import { exists } from 'fs-extra';
// import { RetrievalQAChain } from 'langchain/chains';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { Document } from 'langchain/document';
import path from 'path';

import { embeddings, model } from './config';
import { directory, filename, chainOnePrompt } from './constants';
import { softwareCaller } from '../routers/software';
import { SoftwareShortcut } from '../../../@types';

type ShortcutDocument = Document<{
  key: string;
  id: string;
  hotkeys: string[][];
}>;

async function getVectorStore(docs: ShortcutDocument[]) {
  const isVectorStoreExisted = await exists(path.join(directory, filename));

  let vectorStore: HNSWLib;

  if (!isVectorStoreExisted) {
    vectorStore = await HNSWLib.fromDocuments(docs, embeddings);
    // Save the vector store to a directory
    await vectorStore.save(directory);
  } else {
    vectorStore = await HNSWLib.load(directory, embeddings);
  }

  return vectorStore;
}

async function loadInternalShortcuts({
  softwareKey,
}: {
  softwareKey?: string;
}) {
  let data: SoftwareShortcut[] = [];

  let transformedData: ShortcutDocument[] = [];

  if (softwareKey) {
    const byKey = await softwareCaller.byKey({ key: softwareKey });

    if (byKey && byKey.shortcuts.length) {
      data = [byKey];
    }
  } else {
    const softwareData = await softwareCaller.all();
    if (softwareData && softwareData.length) {
      data = softwareData;
    }

    if (data) {
      transformedData = data.reduce((prev: ShortcutDocument[], curr) => {
        const { key: currKey } = curr.software;

        if (!curr.shortcuts.length) return prev;

        const shortcuts = curr.shortcuts.map((shortcut) => {
          return new Document({
            pageContent: `${shortcut.description}`,
            metadata: {
              id: currKey + shortcut.id,
              hotkeys: shortcut.hotkeys,
              key: currKey,
            },
          });
        });
        return [...prev, ...shortcuts];
      }, []);
    }
  }

  return transformedData;
}

async function similaritySearch(
  vStore: HNSWLib,
  query: string,
  softwareKey: string
) {
  return vStore.similaritySearch(query, 5, (doc) => {
    const { key } = doc.metadata;
    return softwareKey === key;
  });
}

export default async function searchInternalShortcut(
  searchTerm: string,
  softwareKey: string
) {
  let result: any[] = [];

  const docs = await loadInternalShortcuts({ softwareKey });

  if (docs.length > 0) {
    const vStore = await getVectorStore(docs);

    return;

    // const results = await similaritySearch(vStore, searchTerm, softwareKey);

    // if (!results?.length) {
    //   return result;
    // }

    // const qDocs = results
    //   .map((r, index) => `index${index}:${r.pageContent}`)
    //   .join('\n');

    // const vectorStoreRetriever = vStore.asRetriever();

    // const query = await chainOnePrompt.format({
    //   action: searchTerm,
    //   software: softwareKey,
    //   qDocs,
    // });

    // const chainOne = RetrievalQAChain.fromLLM(model, vectorStoreRetriever, {
    //   verbose: true,
    // });

    // result = await chainOne.call({
    //   query,
    // });

    // if (result.text && results[Number(result.text)]) {
    //   result = results[Number(result.text)];
    // }
  }

  return result;
}
function loadModel(arg0: string, arg1: { verbose: boolean }) {
  throw new Error('Function not implemented.');
}

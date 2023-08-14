import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { Document } from 'langchain/document';
import { RetrievalQAChain } from 'langchain/chains';
import { exists } from 'fs-extra';
import path from 'path';

import { mapSystemToReadable } from '../utils';
import { USER_VECTOR_STORE_DIR, fetchSoftwareShortcuts } from '../io';

// store them in a vector store
// index the vector store
// search the vector store with similarity_search
// if found, return it
// if not found, search shortcuts on the internet
// if found, return it
// chain them together

type ShortcutDocument = Document<{
  key: string;
  id: string;
  hotkeys: string[][];
}>;

const model = new OpenAI({
  openAIApiKey: process.env.OPEN_AI_API_KEY,
  temperature: 0,
  maxTokens: 100,
  verbose: true,
});

const system = mapSystemToReadable(process.platform);

const chainOnePrompt = new PromptTemplate({
  template: `{qDocs} Question: These indexes are shortcut descriptions. Find a description that matches {action} . Answer: Return the matching index as a number`,
  inputVariables: ['action', 'qDocs'],
});

const chainTwoPrompt = new PromptTemplate({
  template: `You act as a software shortcut search engine. What is the shortcut for {software} on ${system} to {action}? Create a json file with the shortcut and source output`,
  inputVariables: ['action', 'software'],
});

async function getVectorStore(docs: ShortcutDocument[]) {
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPEN_AI_API_KEY,
    verbose: true,
  });

  const directory = USER_VECTOR_STORE_DIR;
  const filename = 'args.json';

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

export async function loadInternalShortcuts() {
  // todo: use custom JSONLoader
  const softwareShortcuts = await fetchSoftwareShortcuts();

  const flattenDocs = Object.keys(softwareShortcuts).reduce(
    (prev: ShortcutDocument[], curr: string) => {
      const { software, shortcuts } = softwareShortcuts[curr];

      const shortcutsArray = shortcuts.map((shortcut) => {
        return new Document({
          pageContent: `${shortcut.description}`,
          metadata: {
            id: shortcut.id,
            hotkeys: shortcut.hotkeys,
            key: software.key,
          },
        });
      });

      return [...prev, ...shortcutsArray];
    },
    []
  );

  return flattenDocs;
}

async function similaritySearch(
  store: HNSWLib,
  query: string,
  softwareKey: string
) {
  return store.similaritySearch(query, 5, (doc) => {
    const { key } = doc.metadata;
    return softwareKey === key;
  });
}

export async function searchInternalShortcut(
  searchTerm: string,
  softwareKey: string
) {
  let result;

  const docs = await loadInternalShortcuts();

  if (docs.length > 0) {
    const store = await getVectorStore(docs);

    const results = await similaritySearch(store, searchTerm, softwareKey);

    if (!results?.length) {
      return result;
    }

    const qDocs = results
      .map((r, index) => `index${index}:${r.pageContent}`)
      .join('\n');

    const vectorStoreRetriever = store.asRetriever();

    const query = await chainOnePrompt.format({
      action: searchTerm,
      software: softwareKey,
      qDocs,
    });

    const chainOne = RetrievalQAChain.fromLLM(model, vectorStoreRetriever, {
      verbose: true,
    });

    result = await chainOne.call({
      query,
    });

    if (result.text && results[Number(result.text)]) {
      result = results[Number(result.text)];
    }
  }
  return result;
}

export async function searchExternalShortcut(
  searchTerm: string,
  softwareKey: string
) {
  try {
    const input = await chainTwoPrompt.format({
      action: searchTerm,
      software: softwareKey,
      system,
    });

    // console.log(input);
    // const response = await model.call(input);
    // const parsedResponse = await parser.parse(response);

    // console.log(parsedResponse);
  } catch (error: any) {
    // logError(error.message);
    console.log(error.message);
    throw error;
  }
}

function sanitizedData(searchTerm: string, softwareKey: string) {
  // todo: software key should be the human readable name, so we should change the data structure and add a software label to each json
  const sanitizedSoftwareKey = softwareKey.toLowerCase().trim();

  const sanitizedSearchTerm = searchTerm.trim();
  return { key: sanitizedSoftwareKey, term: sanitizedSearchTerm };
}

export async function searchShortcut(searchTerm: string, softwareKey: string) {
  let result;

  const { term, key } = sanitizedData(searchTerm, softwareKey);

  try {
    result = await searchInternalShortcut(term, key);

    console.log({ result });

    // if (!result) {
    //   result = await searchExternalShortcut(searchTerm, sanitizedSoftwareKey);
    // }
    return result;
  } catch (error: any) {
    // logError(error.message);
    console.log(error.message);
    throw error;
  }
}

// store them in a vector store
// index the vector store
// search the vector store with similarity_search
// if found, return it
// if not found, search shortcuts on the internet
// if found, return it
// chain them together

import { logError } from '../utils';
import searchInternalShortcut from './internalSearch';
import { sanitizedData } from './utils';

export default async function langchainSearchShortcuts({
  userPrompt,
  softwareKey,
}: {
  userPrompt: string;
  softwareKey?: string;
}) {
  const result: any[] = [];
  try {
    const { prompt, key } = sanitizedData(userPrompt, softwareKey || '');

    await searchInternalShortcut(prompt, key);

    // if (!result) {
    //   result = await searchExternalShortcut(prompt, key);
    // }

    return result;
  } catch (error: any) {
    logError(error.message);
    throw error;
  }
}

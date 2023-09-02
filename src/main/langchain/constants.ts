import { PromptTemplate } from 'langchain/prompts';
import { mapSystemToReadable } from '../utils';
import { USER_VECTOR_STORE_DIR } from '../utils/path';

export const directory = USER_VECTOR_STORE_DIR;
export const filename = 'args.json';

export const system = mapSystemToReadable(process.platform);

export const chainOnePrompt = new PromptTemplate({
  template: `{qDocs} Question: These indexes are shortcut descriptions. Find a description that matches {action} . Answer: Return the matching index as a number`,
  inputVariables: ['action', 'qDocs'],
});

export const chainTwoPrompt = new PromptTemplate({
  template: `You act as a software shortcut search engine. What is the shortcut for {software} on ${system} to {action}? Create a json file with the shortcut and source output`,
  inputVariables: ['action', 'software'],
});

import { OpenAI } from 'langchain';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { store } from '../utils';

export const openAIApiKey = store.get('openAIApiKey') as string | undefined;

export const model = new OpenAI({
  openAIApiKey,
  temperature: 0,
  maxTokens: 100,
  verbose: true,
});

export const embeddings = new OpenAIEmbeddings({
  openAIApiKey,
  verbose: true,
});

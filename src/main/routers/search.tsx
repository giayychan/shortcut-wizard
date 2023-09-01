import { z } from 'zod';

import { router, publicProcedure } from '../configs/trpc';
import { store } from '../utils';
import langchainSearchShortcuts from '../configs/langchain';

const aiSearchRouter = router({
  saveOpenAIKey: publicProcedure.input(z.string()).mutation(() => {
    return store.set('openAIKey', 'openAIKey');
  }),
  openAIKey: publicProcedure.output(z.string().optional()).mutation(() => {
    return store.get('openAIKey') as string | undefined;
  }),
  search: publicProcedure
    .input(
      z.object({
        softwareKey: z.string().optional(),
        userPrompt: z.string(),
      })
    )
    .output(z.array(z.any()))
    .mutation(async (opts) => {
      const {
        input: { userPrompt, softwareKey },
      } = opts;
      const openAIKey = store.get('openAIKey') as string | undefined;
      if (!openAIKey) throw new Error('OpenAI key is missing');

      await langchainSearchShortcuts({ openAIKey, userPrompt, softwareKey });
      return [];
    }),
});

export default aiSearchRouter;

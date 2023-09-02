import { z } from 'zod';

import { router, publicProcedure } from '../configs/trpc';
import { store } from '../utils';
import langchainSearchShortcuts from '../langchain';

const aiSearchRouter = router({
  openAIApiKey: publicProcedure.output(z.string().optional()).query(() => {
    return store.get('openAIApiKey') as string | undefined;
  }),
  updateOpenAIApiKey: publicProcedure
    .input(z.string())
    .mutation(({ input }) => {
      store.set('openAIApiKey', input);
    }),

  enabledAiSearch: publicProcedure.output(z.boolean()).query(() => {
    return Boolean(store.get('enabledAiSearch'));
  }),
  toggleAiSearch: publicProcedure.input(z.boolean()).mutation(async (opts) => {
    const { input: enabled } = opts;
    store.set('enabledAiSearch', enabled);
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
      console.log({ userPrompt, softwareKey });
      const result = await langchainSearchShortcuts({
        userPrompt,
        softwareKey,
      });
      return result;
    }),
});

export default aiSearchRouter;

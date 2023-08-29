import { initTRPC } from '@trpc/server';
import superjson from 'superjson';

const t = initTRPC.create({ isServer: true, transformer: superjson });
export const { router } = t;
export const publicProcedure = t.procedure;

import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../main/routers/_app';

const trpcReact = createTRPCReact<AppRouter>();

export default trpcReact;

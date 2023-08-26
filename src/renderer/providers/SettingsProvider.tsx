import { ReactNode } from 'react';
import trpcReact from '../utils/trpc';

function AuthProvider({ children }: { children: ReactNode }) {
  trpcReact.settings.processPlatform.useQuery();

  return children;
}

export default AuthProvider;

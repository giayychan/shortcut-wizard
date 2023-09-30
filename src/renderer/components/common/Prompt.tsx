import { ReactNode } from 'react';
import LOGO from '../../../../assets/borderlesslogo.png';

function PromptContainer({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-6 h-96">
      <img src={LOGO} alt="logo" width="100px" height="100px" />
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

export default PromptContainer;

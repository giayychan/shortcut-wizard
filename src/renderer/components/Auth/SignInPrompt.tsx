import { SHORTCUT_WIZARD_HREF } from 'main/constants';
import { Anchor } from '@mantine/core';
import LOGO from '../../../../assets/borderlesslogo.png';
import SignInButton from './SignInButton';

function SignInPrompt() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 my-6">
      <img src={LOGO} alt="logo" width="120px" height="120px" />
      <div className="flex flex-col gap-4">
        <SignInButton />
        <hr className="border-[0.5px] border-gray-500 w-[400px]" />
      </div>
      <div className="flex flex-row">
        <Anchor href={`${SHORTCUT_WIZARD_HREF}/auth/sign-up`} target="_blank">
          Need an account?
        </Anchor>
      </div>
    </div>
  );
}
export default SignInPrompt;

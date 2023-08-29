import { SHORTCUT_WIZARD_HREF } from 'main/constants';
import { Anchor, Divider } from '@mantine/core';
import LOGO from '../../../../assets/borderlesslogo.png';
import SignInButton from './SignInButton';

function SignInPrompt() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 my-6">
      <img src={LOGO} alt="logo" width="120px" height="120px" />
      <div className="flex flex-col items-center gap-4">
        <SignInButton />
        <Divider w={250} />
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

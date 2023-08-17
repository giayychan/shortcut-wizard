import { Anchor } from '@mantine/core';
import LOGO from '../../../../assets/borderlesslogo.png';
import SignInButton from './SignInButton';

function SignInPrompt({ isDisplayed }: { isDisplayed: boolean }) {
  if (!isDisplayed) return null;

  return (
    <div className="my-4 w-full flex flex-col items-center justify-center gap-4">
      <img src={LOGO} alt="logo" width="120px" height="120px" />
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl">Shortcut Wizard</h1>
        <hr className="border-[0.5px] border-gray-500 w-[400px]" />
        <SignInButton />
      </div>
      <div className="flex flex-row gap-10">
        <Anchor
        // href={`/auth/sign-up${
        //   signInFrom ? `?sign_in_from=${signInFrom}` : ''
        // }`}
        >
          Need an account?
        </Anchor>
        <Anchor href="/auth/forgot-password">Forgotten password?</Anchor>
      </div>
    </div>
  );
}

export default SignInPrompt;

import LOGO from '../../../../assets/borderlesslogo.png';
import SignInButton from './SignInButton';

function SignInPrompt({ isDisplayed }: { isDisplayed: boolean }) {
  if (!isDisplayed) return null;

  return (
    <div className="flex flex-col items-center justify-center w-full gap-6 h-96">
      <img src={LOGO} alt="logo" width="50px" height="50px" />
      <div className="flex flex-col gap-4">
        <SignInButton />
      </div>
    </div>
  );
}

export default SignInPrompt;

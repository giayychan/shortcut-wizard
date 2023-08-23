import PromptContainer from '../common/Prompt';
import SignInButton from './SignInButton';

function SignInPrompt({ isDisplayed }: { isDisplayed: boolean }) {
  if (!isDisplayed) return null;

  return (
    <PromptContainer>
      <SignInButton />
    </PromptContainer>
  );
}

export default SignInPrompt;

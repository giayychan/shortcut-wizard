import { Text } from '@mantine/core';
import SignInButton from './SignInButton';

function SignInPrompt({ isDisplayed }: { isDisplayed: boolean }) {
  if (!isDisplayed) return null;

  return (
    <>
      <Text>App is currently offline, features are limited.</Text>
      <SignInButton />
    </>
  );
}

export default SignInPrompt;

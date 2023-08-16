import { Text } from '@mantine/core';
import SignInButton from './SignInButton';

function SignInPrompt({ isDisplayed }: { isDisplayed: boolean }) {
  if (!isDisplayed) return null;

  return (
    <div className="titlebar border-t border-gray-600 py-3 px-5 h-[50px] flex flex-row items-center justify-around">
      <Text>App is currently offline, features are limited.</Text>
      <SignInButton />
    </div>
  );
}

export default SignInPrompt;

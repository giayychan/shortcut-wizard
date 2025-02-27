import { Button } from '@mantine/core';
import { signOut } from 'firebase/auth';
import { auth } from 'main/configs/firebase';

import { SHORTCUT_WIZARD_HREF } from 'main/constants';
import PromptContainer from '../common/Prompt';

function TrialEndPromptContainer() {
  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <PromptContainer>
      {auth?.currentUser?.email ? (
        <p>You are logged in as {auth?.currentUser?.email}</p>
      ) : null}
      <p>
        Your trial has ended. Please purchase the pro plan if you like the app
        ❤️
      </p>

      <Button
        compact
        component="a"
        href={`${
          process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000'
            : SHORTCUT_WIZARD_HREF
        }/pricing`}
        target="_href"
      >
        Buy Plan
      </Button>

      <Button
        compact
        component="a"
        href={`${SHORTCUT_WIZARD_HREF}/contact`}
        target="_href"
      >
        Feedback
      </Button>
      {process.env.NODE_ENV === 'development' ? (
        <Button compact onClick={handleSignOut}>
          Sign Out
        </Button>
      ) : null}
    </PromptContainer>
  );
}

export default TrialEndPromptContainer;

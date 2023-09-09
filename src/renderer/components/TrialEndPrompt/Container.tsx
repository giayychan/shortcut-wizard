import { Button } from '@mantine/core';
import { signOut } from 'firebase/auth';
import { auth } from 'main/configs/firebase';

import { SHORTCUT_WIZARD_HREF } from 'main/constants';
import PromptContainer from '../common/Prompt';
import trpcReact from '../../utils/trpc';

function TrialEndPromptContainer() {
  const utils = trpcReact.useContext();
  const isDev = utils.settings.isDev.getData();

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <PromptContainer>
      <p>
        Your trial has ended. Please purchase the pro plan if you like the app
        ❤️
      </p>

      <Button
        compact
        component="a"
        href={`${SHORTCUT_WIZARD_HREF}/pricing`}
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
      {isDev ? (
        <Button compact onClick={handleSignOut}>
          Sign Out
        </Button>
      ) : null}
    </PromptContainer>
  );
}

export default TrialEndPromptContainer;

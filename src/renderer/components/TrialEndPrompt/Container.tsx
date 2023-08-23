import { Button } from '@mantine/core';

import { SHORTCUT_WIZARD_HREF } from 'main/constants';
import PromptContainer from '../common/Prompt';

function TrialEndPromptContainer() {
  return (
    <PromptContainer>
      <p>Your trial has ended. Please subscribe if you like the app.</p>
      <Button
        component="a"
        href={`${SHORTCUT_WIZARD_HREF}/pricing`}
        target="_href"
      >
        Subscribe
      </Button>
      <Button
        component="a"
        href={`${SHORTCUT_WIZARD_HREF}/feedback`}
        target="_href"
      >
        Feedback
      </Button>
    </PromptContainer>
  );
}

export default TrialEndPromptContainer;

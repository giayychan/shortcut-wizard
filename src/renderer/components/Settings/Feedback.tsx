import { Anchor, Button, Text } from '@mantine/core';
import { SHORTCUT_WIZARD_HREF } from 'main/constants';

function Feedback() {
  return (
    <>
      <Text>Have feedback on Shortcut Wizard? </Text>
      <Anchor href={`${SHORTCUT_WIZARD_HREF}/feedback`} target="_blank">
        <Button compact type="button" color="indigo" w="100%" maw={200}>
          Contact Us
        </Button>
      </Anchor>
    </>
  );
}

export default Feedback;

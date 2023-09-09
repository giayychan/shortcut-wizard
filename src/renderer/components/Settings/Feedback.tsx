import { Anchor, Button, Text } from '@mantine/core';
import { SHORTCUT_WIZARD_HREF } from 'main/constants';

function Feedback() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5">
      <Text className="mr-5">Have feedback on Shortcut Wizard?</Text>
      <Text className="mr-5">
        Don&apos;t hesitate to contact us, we would love to hear from you!
      </Text>
      <Anchor href={`${SHORTCUT_WIZARD_HREF}/contact`} target="_blank">
        <Button type="button" color="indigo" w="100%" maw={200}>
          Contact Us
        </Button>
      </Anchor>
    </div>
  );
}

export default Feedback;

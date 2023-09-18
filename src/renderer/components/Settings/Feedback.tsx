import { Anchor, Button, Text, Center, Flex } from '@mantine/core';
import { SHORTCUT_WIZARD_HREF } from 'main/constants';

function Feedback() {
  return (
    <Center>
      <Flex direction="column" gap="sm">
        <Text size="xl" mb="lg">
          Feedback
        </Text>
        <Text>
          Have feedback on Shortcut Wizard? Let us know how we can improve!
        </Text>
        <Text>
          Don&apos;t hesitate to contact us, we would love to hear from you!
        </Text>
        <Anchor
          mt="sm"
          href={`${SHORTCUT_WIZARD_HREF}/contact`}
          target="_blank"
        >
          <Button variant="outline">Contact Us</Button>
        </Anchor>
      </Flex>
    </Center>
  );
}

export default Feedback;

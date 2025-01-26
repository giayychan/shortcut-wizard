import { Flex, Button, Text } from '@mantine/core';

function BuyMeACoffeeLinkButton() {
  return (
    <Flex direction="column" gap={5} align="center">
      <Text size="sm" weight={700}>
        ❤️ Enjoy this app?
      </Text>

      <Button
        fullWidth
        component="a"
        gradient={{ from: 'red', to: 'purple', deg: 145 }}
        target="_blank"
        variant="gradient"
        href="https://buymeacoffee.com/giawdevtesq"
      >
        Buy me a coffee ☕️
      </Button>
    </Flex>
  );
}

export default BuyMeACoffeeLinkButton;

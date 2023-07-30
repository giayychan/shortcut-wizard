import { Anchor, Flex } from '@mantine/core';

function BrandLogo() {
  return (
    <Flex direction="row-reverse">
      <Anchor
        href="http://localhost:3000"
        // href="https://shortcut-wizard.vercel.app"
        target="_blank"
        size="xs"
        align="right"
        mt={5}
        mr={5}
      >
        Shortcut Wizard
      </Anchor>
    </Flex>
  );
}

export default BrandLogo;

import { Anchor } from '@mantine/core';

// className="absolute top-0 right-0 p-4 tracking-widest"
function BrandLogo() {
  return (
    <Anchor
      href="https://shortcutwizard.io/"
      target="_blank"
      size="xs"
      align="right"
      mt={10}
      mr={5}
    >
      Shortcut Wizard
    </Anchor>
  );
}

export default BrandLogo;

import { Anchor } from '@mantine/core';

// className="absolute top-0 right-0 p-4 tracking-widest"
function BrandLogo() {
  return (
    <Anchor
      href="https://shortcutwizard.io/"
      target="_blank"
      pos="absolute"
      top={0}
      right={0}
      m="1rem"
    >
      Shortcut Wizard
    </Anchor>
  );
}

export default BrandLogo;

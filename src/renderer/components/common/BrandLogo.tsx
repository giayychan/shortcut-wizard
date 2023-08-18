import { Anchor } from '@mantine/core';
import { SHORTCUT_WIZARD_HREF } from 'main/constants';

function BrandLogo() {
  return (
    <Anchor
      href={SHORTCUT_WIZARD_HREF}
      target="_blank"
      size="xs"
      align="right"
      mt={5}
      mr={5}
    >
      Shortcut Wizard
    </Anchor>
  );
}

export default BrandLogo;

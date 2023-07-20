import { ActionIcon, Flex } from '@mantine/core';

import StyledSvg from '../common/StyledSvg';
import Settings from '../Settings/Container';
import useSoftwareShortcutsStore from '../../stores/useSoftwareShortcutsStore';

function SoftwareListContainer() {
  const [softwareShortcuts] = useSoftwareShortcutsStore((state) => [
    state.softwareShortcuts,
  ]);

  const softwareList = Object.keys(softwareShortcuts);

  return (
    <Flex bg="blue" align="center" pos="relative" h="2.25rem">
      {softwareList?.map((softwareKey) => {
        const {
          software: { key, icon },
        } = softwareShortcuts[softwareKey];

        const { dataUri } = icon;

        return (
          <ActionIcon variant="light" size="1.5rem" key={key} title={key}>
            {dataUri && <StyledSvg src={dataUri} />}
          </ActionIcon>
        );
      })}

      <Settings />
    </Flex>
  );
}

export default SoftwareListContainer;

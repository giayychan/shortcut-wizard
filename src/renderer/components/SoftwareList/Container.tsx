import { useEffect, useRef } from 'react';
import {
  UnstyledButton,
  Button,
  ScrollArea,
  Skeleton,
  Flex,
} from '@mantine/core';
import { openContextModal } from '@mantine/modals';

import StyledSvg from '../common/StyledSvg';
import useSelectedShortcutsStore from '../../stores/useSelectedShortcutsStore';
import { SoftwareShortcut } from '../../../../@types';
import trpcReact from '../../utils/trpc';

function SoftwareList({
  softwareShortcuts,
}: {
  softwareShortcuts: SoftwareShortcut[];
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const utils = trpcReact.useContext();
  const [selected, setSelected] = useSelectedShortcutsStore((state) => [
    state.selectedSoftwareShortcut,
    state.setSelectedSoftwareShortcut,
  ]);

  const { data: settings } = trpcReact.settings.get.useQuery();

  const { mutateAsync: updateMostRecent } =
    trpcReact.software.sort.updateMostRecent.useMutation();

  const scrollToLeft = () =>
    viewport.current?.scrollTo({ left: 0, behavior: 'smooth' });

  if (softwareShortcuts.length === 0) return null;

  const handleSelect = async (key: string) => {
    if (selected?.software.key === key) {
      setSelected(null);
    } else {
      const selectedSoftwareData = softwareShortcuts.find(
        (softwareData) => softwareData.software.key === key
      );
      setSelected(selectedSoftwareData || null);

      if (settings?.sortSoftwareByRecentOpened) {
        await updateMostRecent(key);
        await utils.software.all.refetch();
        scrollToLeft();
      }
    }
  };

  return (
    <ScrollArea
      type="auto"
      scrollbarSize={5}
      offsetScrollbars
      viewportRef={viewport}
    >
      <div className="flex flex-row gap-1 pb-2">
        {softwareShortcuts.map((softwareData) => {
          const { software } = softwareData;
          const { key, icon } = software;
          const isSelected = selected?.software.key === key;

          return (
            <UnstyledButton
              key={key}
              variant="filled"
              onClick={() => handleSelect(key)}
              className="capitalize rounded"
              bg={isSelected ? 'dark.6' : 'dark.7'}
            >
              <Flex align="center" gap={4} className="px-2 py-1 text-[15px]">
                <StyledSvg src={icon.dataUri} />
                {key}
              </Flex>
            </UnstyledButton>
          );
        })}
      </div>
    </ScrollArea>
  );
}

function SoftwareListContainer() {
  const { data, isLoading } = trpcReact.software.all.useQuery();

  const [selectedSoftware, setSelectedSoftware] = useSelectedShortcutsStore(
    (state) => [
      state.selectedSoftwareShortcut,
      state.setSelectedSoftwareShortcut,
    ]
  );

  useEffect(() => {
    if (selectedSoftware) {
      if (data) {
        const updatedSelectedSoftware = data.find((softwareShortcut) => {
          return (
            softwareShortcut.software.key === selectedSoftware.software.key
          );
        });
        if (updatedSelectedSoftware)
          setSelectedSoftware(updatedSelectedSoftware);
      } else setSelectedSoftware(null);

      // todo: remove search results
    }
  }, [selectedSoftware, setSelectedSoftware, data]);

  if (isLoading) return <Skeleton h={50} />;

  if (!data?.length)
    return (
      <div className="ml-2 h-[50px]">
        <Button
          variant="outline"
          onClick={() =>
            openContextModal({
              modal: 'openSettings',
              fullScreen: true,
              withCloseButton: false,
              innerProps: {
                selectedSettingsTab: 2,
              },
            })
          }
        >
          Add software
        </Button>
      </div>
    );

  return <SoftwareList softwareShortcuts={data} />;
}

export default SoftwareListContainer;

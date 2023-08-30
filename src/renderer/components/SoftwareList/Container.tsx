import { useEffect, useRef } from 'react';
import { Button, Flex, ScrollArea, Skeleton } from '@mantine/core';
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

  const { mutateAsync: updateMostRecent } =
    trpcReact.software.sort.updateMostRecent.useMutation();

  const scrollToLeft = () =>
    viewport.current?.scrollTo({ left: 0, behavior: 'smooth' });

  if (softwareShortcuts.length === 0) return null;

  const handleSelect = async (key: string) => {
    if (selected?.software.key === key) {
      setSelected(null);
    } else {
      await updateMostRecent(key);
      const selectedSoftwareData = softwareShortcuts.find(
        (softwareData) => softwareData.software.key === key
      );
      setSelected(selectedSoftwareData || null);
      await utils.software.all.refetch();
      scrollToLeft();
    }
  };

  return (
    <ScrollArea
      type="auto"
      scrollbarSize={5}
      offsetScrollbars
      viewportRef={viewport}
    >
      <div className="flex flex-row px-3.5 overflow-auto">
        {softwareShortcuts.map((softwareData) => {
          const { software } = softwareData;
          const { key, icon } = software;
          const isSelected = selected?.software.key === key;

          return (
            <Button
              h={60}
              variant={isSelected ? 'light' : 'subtle'}
              onClick={() => handleSelect(key)}
            >
              <Flex
                direction="column"
                align="center"
                className="capitalize"
                gap={5}
              >
                <StyledSvg src={icon.dataUri} />
                {key}
              </Flex>
            </Button>
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

  if (isLoading) return <Skeleton h={70} />;

  if (!data?.length)
    return (
      <div className="ml-4 h-[70px]">
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

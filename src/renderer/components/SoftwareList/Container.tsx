import { useEffect, useRef } from 'react';
import { Button, ScrollArea, Skeleton, Text } from '@mantine/core';
import { openContextModal } from '@mantine/modals';
import { useSearchParams } from 'react-router-dom';

import StyledSvg from '../common/StyledSvg';
import useSelectedShortcutsStore from '../../stores/useSelectedShortcutsStore';
import { SoftwareShortcut } from '../../../../@types';
import trpcReact from '../../utils/trpc';
import { notifyClientError } from '../../utils';

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
    <ScrollArea type="auto" scrollbarSize={5} viewportRef={viewport}>
      <div className="flex flex-row gap-1 px-2 pb-2">
        {softwareShortcuts.map((softwareData) => {
          const { software } = softwareData;
          const { key, icon, label } = software;
          const isSelected = selected?.software.key === key;

          return (
            <Button
              key={key}
              variant="default"
              onClick={() => handleSelect(key)}
              className="w-full rounded"
              bg={isSelected ? 'dark.6' : 'dark.7'}
              leftIcon={<StyledSvg src={icon.dataUri} />}
            >
              <Text>{label}</Text>
            </Button>
          );
        })}
      </div>
    </ScrollArea>
  );
}

function SoftwareListContainer() {
  const { data, isLoading, error } = trpcReact.software.all.useQuery();
  const [, setSearchParams] = useSearchParams();

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
        else setSelectedSoftware(null);
      }
    }
  }, [selectedSoftware, setSelectedSoftware, data]);

  useEffect(() => {
    if (error) {
      notifyClientError(`Error during fetching shortcuts: ${error.message}`);
    }
  }, [error]);

  if (isLoading) return <Skeleton h={50} />;

  if (!data?.length)
    return (
      <div className="ml-2 h-[50px] flex items-center">
        <Button
          variant="light"
          onClick={() => {
            openContextModal({
              modal: 'openSettings',
              fullScreen: true,
              withCloseButton: false,
              innerProps: {
                selectedSettingsTab: 'Add Software',
              },
            });
            setSearchParams({ from: 'main' });
          }}
        >
          Add software
        </Button>
      </div>
    );

  return <SoftwareList softwareShortcuts={data} />;
}

export default SoftwareListContainer;

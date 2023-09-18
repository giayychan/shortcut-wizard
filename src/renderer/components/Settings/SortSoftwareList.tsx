/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  UniqueIdentifier,
} from '@dnd-kit/core';
import { IconMenu2 } from '@tabler/icons-react';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Group, ScrollArea, Text } from '@mantine/core';
import StyledSvg from '../common/StyledSvg';
import { SoftwareShortcut } from '../../../../@types';
import trpcReact from '../../utils/trpc';

function SortableItem({
  id,
  software,
}: {
  id: UniqueIdentifier;
  software: SoftwareShortcut['software'];
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Group
      mb="xs"
      px="xs"
      py={1}
      className="select-none"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <IconMenu2 size="0.85rem" />
      <StyledSvg src={software.icon.dataUri} />
      <Text size="sm">{software.label}</Text>
    </Group>
  );
}

function SortList({ softwareData }: { softwareData: SoftwareShortcut[] }) {
  const { mutateAsync } = trpcReact.software.sort.update.useMutation();

  const softwaresWithId = softwareData.map((data, index) => ({
    id: index + 1,
    software: data.software,
  }));

  const [items, setItems] = useState(softwaresWithId || []);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((data) => {
        const oldIndex = data.findIndex(
          (item) => item.id === (active.id as any)
        );
        const newIndex = data.findIndex(
          (item) => item.id === (over?.id as any)
        );

        const updateArr = arrayMove(data, oldIndex, newIndex);

        mutateAsync(updateArr.map((item) => item.software.key));

        return updateArr;
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <ScrollArea h="100%" offsetScrollbars>
          {items.map(({ id, software }) => (
            <SortableItem key={id} id={id} software={software} />
          ))}
        </ScrollArea>
      </SortableContext>
    </DndContext>
  );
}

function SortSoftwareListContainer() {
  const utils = trpcReact.useContext();
  const softwareData = utils.software.all.getData();

  useEffect(() => {
    return () => {
      utils.software.all.refetch();
    };
  }, [utils.software.all]);

  return (
    <>
      <Text size="xl" mb="lg">
        Sort Software
      </Text>
      {softwareData ? <SortList softwareData={softwareData} /> : null}
    </>
  );
}

export default SortSoftwareListContainer;

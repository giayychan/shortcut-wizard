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
import { Aside, Flex, Group, ScrollArea, Text } from '@mantine/core';
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
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Group
        mb="xs"
        p="xs"
        className="duration-300 border border-gray-700 rounded select-none hover:bg-gray-700"
      >
        <IconMenu2 />
        <StyledSvg src={software.icon.dataUri} />
        <Text>{software.key}</Text>
      </Group>
    </div>
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
    <Aside>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <Flex direction="column" h="100%" p="md" pt={40} gap="md">
            <ScrollArea offsetScrollbars>
              {items.map(({ id, software }) => (
                <SortableItem key={id} id={id} software={software} />
              ))}
            </ScrollArea>
          </Flex>
        </SortableContext>
      </DndContext>
    </Aside>
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

  return softwareData ? <SortList softwareData={softwareData} /> : null;
}

export default SortSoftwareListContainer;

import { Text, Kbd, Flex, rem } from '@mantine/core';

function Hotkey({ hotkey }: { hotkey: { id: number; value: string }[] }) {
  return (
    <Flex>
      {hotkey?.map(({ id, value: key }, index) => {
        return (
          <Flex key={id}>
            {index !== 0 && <Text mx={4}>+</Text>}
            <Kbd miw={rem(25)} className="text-center">
              {key}
            </Kbd>
          </Flex>
        );
      })}
    </Flex>
  );
}

export default Hotkey;

import { Text, Kbd, Flex, rem } from '@mantine/core';
import { mapKeyToMacReadable } from '../../utils';
import trpcReact from '../../utils/trpc';

function Hotkey({ hotkey }: { hotkey: { id: number; value: string }[] }) {
  const utils = trpcReact.useContext();
  const processPlatform = utils.settings.processPlatform.getData();

  if (!hotkey?.length) return null;

  return (
    <Flex>
      {hotkey?.map(({ id, value: key }, index) => {
        const readableKey =
          processPlatform === 'darwin' ? mapKeyToMacReadable(key) : key;

        return (
          <Flex key={id}>
            {index !== 0 && <Text mx={4}>+</Text>}
            <Kbd miw={rem(25)} className="text-center lowercase">
              {readableKey}
            </Kbd>
          </Flex>
        );
      })}
    </Flex>
  );
}

export default Hotkey;

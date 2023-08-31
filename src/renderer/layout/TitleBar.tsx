import { Flex, Text, Image, Paper } from '@mantine/core';
import StatusBar from '../components/StatusBar/Container';
import LOGO from '../../../assets/borderlesslogo.png';

export default function TitleBar() {
  return (
    <Paper className="sticky top-0 z-10">
      <Flex
        justify="center"
        align="center"
        h={35}
        className="titlebar"
        gap={10}
      >
        <Flex justify="center">
          <Image maw={20} src={LOGO} alt="Brand logo" pt={3} mr={8} />
          <Text size={15} fw={500}>
            Shortcut Wizard
          </Text>
        </Flex>
        <StatusBar />
      </Flex>
    </Paper>
  );
}

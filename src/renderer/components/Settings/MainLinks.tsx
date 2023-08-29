import { UnstyledButton, Group, ThemeIcon, Text } from '@mantine/core';
import { ReactNode, Dispatch, SetStateAction } from 'react';

interface MainLinkProps {
  icon: ReactNode;
  color: string;
  label: string;
  setSelected: () => void;
  selected: boolean;
}

function MainLink({
  icon,
  color,
  label,
  selected,
  setSelected,
}: MainLinkProps) {
  return (
    <UnstyledButton
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color: selected ? theme.colors.dark[0] : theme.colors.dark[2],
        backgroundColor: selected ? theme.colors.dark[6] : theme.colors.dark[7],
        '&:hover': {
          backgroundColor: theme.colors.dark[6],
        },
      })}
      onClick={() => setSelected()}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>

        {label && (
          <Text size="sm" truncate>
            {label}
          </Text>
        )}
      </Group>
    </UnstyledButton>
  );
}

export default function MainLinks({
  setSelected,
  selected,
  data,
}: {
  setSelected: Dispatch<SetStateAction<number>>;
  selected: number;
  data: {
    icon: ReactNode;
    color: string;
    label: string;
  }[];
}) {
  const links = data.map((link, index) => (
    <MainLink
      icon={link.icon}
      color={link.color}
      label={link.label}
      selected={selected === index}
      setSelected={() => setSelected(index)}
      key={link.label}
    />
  ));

  return <div>{links}</div>;
}

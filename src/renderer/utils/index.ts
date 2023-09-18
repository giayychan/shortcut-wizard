import { notifications } from '@mantine/notifications';

export const mapArrayWithId = (source: any[]): any[] => {
  if (!source) return source;
  if (!Array.isArray(source)) return source;

  return source.map((value, index) => ({
    id: index,
    value: mapArrayWithId(value),
  }));
};

export const notifyClientError = (message: string) => {
  if (!message) return;
  notifications.show({
    message,
    color: 'red',
  });
};

export const notifyClientInfo = (message: string) => {
  if (!message) return;
  notifications.show({
    message,
    color: 'indigo',
  });
};

export const mapKeyToMacReadable = (key: string) => {
  switch (key) {
    case 'meta':
      return 'cmd';
    case 'alt':
      return 'opt';
    default:
      return key;
  }
};

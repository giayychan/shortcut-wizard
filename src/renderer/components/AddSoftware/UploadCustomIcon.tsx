import { FocusTrap, FileInput, rem } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { UploadCustomIconProps } from '../../../../@types';

function UploadCustomIcon({ active, form }: UploadCustomIconProps) {
  return (
    <FocusTrap active={active}>
      <FileInput
        label="Upload Icon"
        placeholder="Upload icon"
        accept="image/svg+xml"
        icon={<IconUpload size={rem(14)} />}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...form.getInputProps('file')}
        onChange={(uploadFile) => {
          form.setFieldValue('software.icon.filename', uploadFile?.path || '');
          form.setFieldValue('file', uploadFile);
        }}
      />
    </FocusTrap>
  );
}

export default UploadCustomIcon;

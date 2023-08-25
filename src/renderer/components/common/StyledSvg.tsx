/* eslint-disable react/require-default-props */
import { Box } from '@mantine/core';
import { ReactSVG } from 'react-svg';
import { StyledSvgProps } from '../../../../@types';

function StyledSvg({ src, className }: StyledSvgProps) {
  if (!src) return null;
  return (
    <Box
      w={24}
      h={24}
      style={{
        overflow: 'auto',
      }}
    >
      <ReactSVG
        src={src}
        className={`${className || ''}`}
        beforeInjection={(rtSvg) => {
          rtSvg.setAttribute('width', '24px');
          rtSvg.setAttribute('height', '24px');
        }}
      />
    </Box>
  );
}

export default StyledSvg;

/* eslint-disable react/require-default-props */
import { ReactSVG } from 'react-svg';
import { StyledSvgProps } from '../../../../@types';

function StyledSvg({ src, className }: StyledSvgProps) {
  return <ReactSVG src={src} className={`${className || ''}`} />;
}

export default StyledSvg;

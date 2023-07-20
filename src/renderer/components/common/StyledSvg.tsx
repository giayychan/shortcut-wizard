/* eslint-disable react/require-default-props */
import { ReactSVG } from 'react-svg';

type Props = {
  className?: string;
  src: string;
};

function StyledSvg({ src, className }: Props) {
  return (
    <ReactSVG
      src={src}
      className={`[&_.injected-svg]:stroke-steam ${className}`}
      // beforeInjection={(rtSvg) => {
      // const width = rtSvg.getAttribute('width');
      // const height = rtSvg.getAttribute('height');
      // rtSvg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      // rtSvg.setAttribute('preserveAspectRatio', 'none');
      // rtSvg.setAttribute('fill', '#dddddd');
      // rtSvg.setAttribute('stroke', '#dddddd');
      // }}
    />
  );
}

export default StyledSvg;

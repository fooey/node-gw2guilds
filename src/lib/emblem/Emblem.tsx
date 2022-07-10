import { castArray, get, keyBy } from 'lodash';
import { IGuildEmblem } from '~/types/Guild';

import classNames from 'classnames';
import { ReactSVGElement } from 'react';
import colors from '~/data/colors.json';
import backgrounds from '~/legacy/lib/gw2emblem/defs.background.json';
import foregrounds from '~/legacy/lib/gw2emblem/defs.foreground.json';
import { IClassName } from '~/types/ClassName';
import { IReactHTMLElement } from '~/types/ReactHTMLElement';
import {
  BG_OPACITY,
  BLEND_OPACITY,
  DEFAULT_BG_COLORID,
  DEFAULT_FG_PRIMARY_COLORID,
  DEFAULT_FG_SECONDARY_COLORID,
  DEFAULT_MATRIX,
  SHADOW_COLOR,
  SHADOW_OPACITY,
} from './constants';

const colorsById = keyBy(colors, 'id');

const BASE_SIZE = 256;

export interface IEmblemProps extends IReactHTMLElement<SVGSVGElement> {
  emblem: IGuildEmblem;
  className?: IClassName;
}
export const Emblem: React.FC<IEmblemProps> = ({ emblem, className, ...attrs }) => {
  const size = emblem.size ?? BASE_SIZE;

  return (
    <svg
      className={classNames(className)}
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      {...attrs}
    >
      <desc>Created by https://guilds.gw2w2w.com/</desc>
      <BackgroundLayer emblem={emblem} />
      <ForegroundLayer emblem={emblem} />
    </svg>
  );
};

const BackgroundLayer: React.FC<IEmblemProps> = ({ emblem }) => {
  const bg = emblem.background_id ? get(backgrounds, emblem.background_id) : null;
  const color = colorsById[emblem.background_color_id ?? DEFAULT_BG_COLORID].cloth.rgb;

  if (!bg) {
    return null;
  }

  const bgTransforms = getTransforms(
    !!emblem.flags_flip_bg_horizontal,
    !!emblem.flags_flip_bg_vertical,
    bg.size,
    emblem.size ?? BASE_SIZE
  );

  return <Group fill={color} opacity={BG_OPACITY} transform={bgTransforms} paths={castArray(bg.p)} />;
};

const ForegroundLayer: React.FC<IEmblemProps> = ({ emblem }) => {
  const fg = emblem.foreground_id ? get(foregrounds, emblem.foreground_id) : null;
  const color = colorsById[emblem.foreground_primary_color_id ?? DEFAULT_FG_PRIMARY_COLORID].cloth.rgb;
  const color2 = colorsById[emblem.foreground_secondary_color_id ?? DEFAULT_FG_SECONDARY_COLORID].cloth.rgb;

  if (!fg) {
    return null;
  }

  const fgTransforms = getTransforms(
    !!emblem.flags_flip_fg_horizontal,
    !!emblem.flags_flip_fg_vertical,
    fg.size,
    emblem.size ?? BASE_SIZE
  );

  return (
    <g transform={fgTransforms}>
      <Group fill={color} paths={fg.p2} />
      <Group fill={color2} paths={fg.p1} />
      <Group fill={color2} opacity={BLEND_OPACITY} paths={fg.pt1} />
      <Group fill={SHADOW_COLOR} opacity={SHADOW_OPACITY} paths={fg.pto2} />
    </g>
  );
};

interface IGroupProps {
  paths: string[];
  fill: number[];
  opacity?: number;
  transform?: string;
}
const Group: React.FC<IGroupProps> = ({ paths, fill, opacity, transform }) => {
  if (!paths.length) {
    return null;
  }

  const pathOpacity = opacity !== 1 ? opacity : undefined;
  const rgbFill = `rgb(${fill})`;

  return (
    <g fill={rgbFill} strokeWidth="0.05%" strokeOpacity="50%" opacity={pathOpacity} transform={transform}>
      <Paths paths={paths} />
    </g>
  );
};
Group.defaultProps = {
  opacity: 1,
};

interface IPathProps {
  paths: string[];
}
const Paths: React.FC<IPathProps> = ({ paths }) => (
  <>
    {paths.map((path, i) => (
      <path key={i} d={path} />
    ))}
  </>
);

const getTransforms = (flipHorizontal: boolean, flipVertical: boolean, inputSize: number, outputSize: number) => {
  if (flipHorizontal || flipVertical || inputSize !== outputSize) {
    const transformMatrix = getTransformMatrix(flipHorizontal, flipVertical, inputSize, outputSize).join(',');
    return `matrix(${transformMatrix})`;
  } else {
    return undefined;
  }
};

// // black magic: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform#matrix
const getTransformMatrix = (flipHorizontal: boolean, flipVertical: boolean, inputSize: number, outputSize: number) => {
  let [a, b, c, d, e, f] = [...DEFAULT_MATRIX];

  if (outputSize !== inputSize) {
    const scale = outputSize / inputSize;
    a = scale;
    d = scale;
  }

  if (flipHorizontal) {
    a = -a;
    e = outputSize;
  }

  if (flipVertical) {
    f = outputSize;
    d = -d;
  }

  return [a, b, c, d, e, f];
};

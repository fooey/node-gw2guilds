import { castArray, get, keyBy } from 'lodash';
import { IGuildEmblem } from '~/types/Guild';

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
} from '../lib/emblem/constants';

const colorsById = keyBy(colors, 'id');

const BASE_SIZE = 256;

export interface IEmblemSVGProps extends IReactHTMLElement<SVGSVGElement> {
  emblem: IGuildEmblem;
  className?: IClassName;
}
export const EmblemSVG: React.FC<IEmblemSVGProps> = ({ emblem, className, ...attrs }) => {
  const size = emblem.size ?? BASE_SIZE;

  return (
    <svg
      {...attrs}
      className={`${className ?? ''} emblem-svg`}
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
    >
      <desc>Created by https://guilds.gw2w2w.com/</desc>
      <BackgroundLayer {...emblem} />
      <ForegroundLayer {...emblem} />
    </svg>
  );
};

type IBackgroundLayerProps = Pick<
  IGuildEmblem,
  | 'background_id'
  | 'background_color_id'
  | 'flags_flip_bg_horizontal'
  | 'flags_flip_bg_vertical'
  | 'size'
  | 'flags_bg_shadow'
>;

const BackgroundLayer: React.FC<IBackgroundLayerProps> = ({
  background_id,
  background_color_id,
  flags_flip_bg_horizontal,
  flags_flip_bg_vertical,
  size,
  flags_bg_shadow,
}) => {
  const bg = background_id ? get(backgrounds, background_id) : null;
  const color = colorsById[background_color_id ?? DEFAULT_BG_COLORID].cloth.rgb;

  if (!bg) {
    return null;
  }

  const bgTransforms = getTransforms(!!flags_flip_bg_horizontal, !!flags_flip_bg_vertical, bg.size, size);

  return (
    <Group
      paths={castArray(bg.p)}
      fill={color}
      opacity={BG_OPACITY}
      transform={bgTransforms}
      style={flags_bg_shadow ? { filter: 'drop-shadow(3px 5px 2px rgb(0 0 0 / 0.8))' } : undefined}
    />
  );
};

type IForegroundLayerProps = Pick<
  IGuildEmblem,
  | 'foreground_id'
  | 'foreground_primary_color_id'
  | 'foreground_secondary_color_id'
  | 'flags_flip_fg_horizontal'
  | 'flags_flip_fg_vertical'
  | 'size'
  | 'flags_fg_shadow'
>;
const ForegroundLayer: React.FC<IForegroundLayerProps> = ({
  foreground_id,
  foreground_primary_color_id,
  foreground_secondary_color_id,
  flags_flip_fg_horizontal,
  flags_flip_fg_vertical,
  size,
  flags_fg_shadow,
}) => {
  const fg = foreground_id ? get(foregrounds, foreground_id) : null;
  const color = colorsById[foreground_primary_color_id ?? DEFAULT_FG_PRIMARY_COLORID].cloth.rgb;
  const color2 = colorsById[foreground_secondary_color_id ?? DEFAULT_FG_SECONDARY_COLORID].cloth.rgb;

  if (!fg) {
    return null;
  }

  const fgTransforms = getTransforms(!!flags_flip_fg_horizontal, !!flags_flip_fg_vertical, fg.size, size);

  return (
    <g
      transform={fgTransforms}
      style={flags_fg_shadow ? { filter: 'drop-shadow(3px 5px 2px rgb(0 0 0 / 0.8))' } : undefined}
    >
      <Group paths={fg.p2} fill={color} opacity={1} />
      <Group paths={fg.p1} fill={color2} opacity={1} />
      <Group paths={fg.pt1} fill={color2} opacity={BLEND_OPACITY} />
      <Group paths={fg.pto2} fill={SHADOW_COLOR} opacity={SHADOW_OPACITY} />
    </g>
  );
};

interface IGroupProps extends IReactHTMLElement<SVGGElement> {
  paths: string[];
  fill: number[];
  opacity: number;
  transform?: string;
}
const Group: React.FC<IGroupProps> = ({ paths, fill, opacity, transform, ...attrs }) => {
  if (!paths.length) {
    return null;
  }

  const pathOpacity = opacity !== 1 ? opacity : undefined;
  const rgbFill = `rgb(${fill})`;

  return (
    <g {...attrs} fill={rgbFill} opacity={pathOpacity} transform={transform} strokeWidth="0.05%" strokeOpacity="50%">
      {paths.map((path, i) => (
        <path key={i} d={path} />
      ))}
    </g>
  );
};

const getTransforms = (
  flipHorizontal: boolean,
  flipVertical: boolean,
  inputSize: number,
  outputSize: number = BASE_SIZE
) => {
  if (flipHorizontal || flipVertical || inputSize !== outputSize) {
    const transformMatrix = getTransformMatrix(flipHorizontal, flipVertical, inputSize, outputSize);
    return `matrix(${transformMatrix})`;
  } else {
    return undefined;
  }
};

// black magic: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform#matrix
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

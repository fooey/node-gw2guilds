import { castArray, compact, get, keyBy } from 'lodash';
import prettier from 'prettier';
import { IGuildEmblem, IGuildEmblemBackground, IGuildEmblemForeground } from '~/types/Guild';

import colors from '~/data/colors.json';
import backgrounds from '~/legacy/lib/gw2emblem/defs.background.json';
import foregrounds from '~/legacy/lib/gw2emblem/defs.foreground.json';
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

export const renderEmblem = (emblem: IGuildEmblem): string => {
  const size = emblem.size ?? BASE_SIZE;

  const bgGroup = getBgGroup(emblem);
  const fgGroup = getFgGroup(emblem);

  const svg = [
    `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" shape-rendering="geometricPrecision" version="1.1" xmlns="http://www.w3.org/2000/svg" >`,
    `<desc>Created by https://guilds.gw2w2w.com/</desc>`,
    bgGroup,
    fgGroup,
    `</svg>`,
  ];

  return prettier.format(svg.join('\n'), { parser: 'html', printWidth: 512 });
};

const getBgGroup = (emblem: IGuildEmblemBackground) => {
  const bg = emblem.background_id ? get(backgrounds, emblem.background_id) : null;
  const color = colorsById[emblem.background_color_id ?? DEFAULT_BG_COLORID].cloth.rgb;

  if (!bg) {
    return '';
  }

  const bgTransforms = getTransforms({
    flipHorizontal: !!emblem.flags_flip_bg_horizontal,
    flipVertical: !!emblem.flags_flip_bg_vertical,
    inputSize: bg.size,
    outputSize: emblem.size ?? BASE_SIZE,
  });

  const paths = createPaths(castArray(bg.p));
  const shapes = [renderGroup(paths, color, BG_OPACITY)];

  return [`<g ${bgTransforms}>`, ...shapes, `</g>`].join('\n');
};

const getFgGroup = (emblem: IGuildEmblemForeground) => {
  const fg = emblem.foreground_id ? get(foregrounds, emblem.foreground_id) : null;
  const color = colorsById[emblem.foreground_primary_color_id ?? DEFAULT_FG_PRIMARY_COLORID].cloth.rgb;
  const color2 = colorsById[emblem.foreground_secondary_color_id ?? DEFAULT_FG_SECONDARY_COLORID].cloth.rgb;

  if (!fg) {
    return '';
  }

  const fgTransforms = getTransforms({
    flipHorizontal: !!emblem.flags_flip_fg_horizontal,
    flipVertical: !!emblem.flags_flip_fg_vertical,
    inputSize: fg.size,
    outputSize: emblem.size ?? BASE_SIZE,
  });

  const shapes = compact([
    fg.p2.length ? renderGroup(createPaths(fg.p2), color, 1) : '',
    fg.p1.length ? renderGroup(createPaths(fg.p1), color2, 1) : '',
    fg.pt1.length ? renderGroup(createPaths(fg.pt1), color2, BLEND_OPACITY) : '',
    fg.pto2.length ? renderGroup(createPaths(fg.pto2), SHADOW_COLOR, SHADOW_OPACITY) : '',
  ]);

  // return [`<g ${fgTransforms}>`, ...shapes, `</g>`].join('\n');
  return [`<g ${fgTransforms}>`, ...shapes, `</g>`].join('\n');
};

const createPaths = (paths: string[]) => castArray(paths).map((path) => `<path d="${path}" />`);

const renderGroup = (paths: string[], fill: number[], opacity: number = 1) => {
  const pathAttribs = [`fill="rgb(${fill})"`, `stroke="rgb(${fill})"`, `stroke-width="0.05%"`, `stroke-opacity="50%"`];

  if (opacity !== 1) {
    pathAttribs.push(`opacity="${opacity}"`);
  }

  return `<g ${pathAttribs.join(' ')}>${paths.join('\n')}</g>`;
};

interface ITransforms {
  flipHorizontal: boolean;
  flipVertical: boolean;
  inputSize: number;
  outputSize: number;
}
const getTransforms = (props: ITransforms) => {
  const { flipHorizontal, flipVertical, inputSize, outputSize } = props;

  if (flipHorizontal || flipVertical || inputSize !== outputSize) {
    const transformMatrix = getTransformMatrix(props);
    return `transform="matrix(${transformMatrix.join()})"`;
  } else {
    return '';
  }
};

// black magic: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/transform#matrix
const getTransformMatrix = (props: ITransforms) => {
  const { flipHorizontal, flipVertical, inputSize, outputSize } = props;
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

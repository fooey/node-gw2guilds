import { keyBy, max, min } from 'lodash';
import { backgrounds, colors, colorsById, foregrounds } from './resources';

export const SHADOW_COLOR = [0, 0, 0];
export const SHADOW_OPACITY = 0.3;

export const BG_OPACITY = 0.7;
export const BLEND_OPACITY = 0.3;

export const BASE_SIZE = 256;
export const DEFAULT_MATRIX = [1, 0, 0, 1, 0, 0];

export const COLORID_ABYSS = 473;
export const COLORID_RED = 673;
export const COLORID_CELESTIAL = 6;

export const DEFAULT_BG_COLORID = COLORID_ABYSS;
export const DEFAULT_FG_PRIMARY_COLORID = COLORID_RED;
export const DEFAULT_FG_SECONDARY_COLORID = COLORID_CELESTIAL;

export const EMBLEM_SWATCH_SIZE = '192';

export const backgroundIds = Object.keys(backgrounds).map(Number);
export const minBackgroundId = min(backgroundIds) as number;
export const maxBackgroundId = max(backgroundIds) as number;

export const foregroundIds = Object.keys(foregrounds).map(Number);
export const minForegroundId = min(foregroundIds) as number;
export const maxForegroundId = max(foregroundIds) as number;

export const colorIds = Object.keys(colors).map(Number);
export const minColorId = min(colorIds) as number;
export const maxColorId = max(colorIds) as number;

const colorCategoriesSet = colors.reduce((acc, color) => {
  color.categories.forEach((category) => {
    acc.add(category);
  });
  return acc;
}, new Set<string>());
export const colorCategories = Array.from(colorCategoriesSet);

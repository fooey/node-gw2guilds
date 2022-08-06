import { keyBy } from 'lodash';
import _colors from '~/assets/colors.json';
import _backgrounds from '~/data/defs.background.json';
import _foregrounds from '~/data/defs.foreground.json';

export type IBackground = typeof backgrounds[keyof typeof backgrounds];
export type IForeground = typeof foregrounds[keyof typeof foregrounds];
export type IColor = typeof colors[number];

export const backgrounds = _backgrounds;
export const foregrounds = _foregrounds;
export const colors = _colors;

export const colorsById = keyBy(colors, 'id');

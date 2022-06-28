import _backgrounds from '~/legacy/lib/gw2emblem/defs.background.json';
import _colors from '~/legacy/lib/gw2emblem/defs.color2.json';
import _foregrounds from '~/legacy/lib/gw2emblem/defs.foreground.json';

export type IBackground = typeof backgrounds[keyof typeof backgrounds];
export type IForeground = typeof foregrounds[keyof typeof foregrounds];
export type IColor = typeof colors[number];

export const backgrounds = _backgrounds;
export const foregrounds = _foregrounds;
export const colors = _colors;

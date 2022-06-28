import { has, toSafeInteger } from 'lodash';
import { NextApiRequestQuery } from 'next/dist/server/api-utils';
import { IGuildEmblem, IGuildEmblemBackground, IGuildEmblemForeground } from '~/types/Guild';

export const getValidatedEmblemParams = (query: NextApiRequestQuery) => {
  const errors: string[] = [];

  const validatedBgParams = getValidatedBgParams(query);
  const validatedFgParams = getValidatedFgParams(query);

  const emblem: IGuildEmblem = {
    ...validatedBgParams.emblemBg,
    ...validatedFgParams.emblemFg,
  };
  errors.push(...validatedBgParams.errors);
  errors.push(...validatedFgParams.errors);

  return { errors, emblem };
};

export const getValidatedBgParams = (
  query: NextApiRequestQuery
): { errors: string[]; emblemBg: IGuildEmblemBackground } => {
  const emblemBg: IGuildEmblemBackground = {} as IGuildEmblemBackground;
  const errors = [];

  if (has(query, 'size') && query.size !== undefined) {
    if (isValidInt(query.size)) {
      emblemBg.size = asInt(query.size as string);
    } else {
      errors.push(`invalid size: "${query.size}"`);
    }
  }

  if (has(query, 'background_id') && query.background_id !== '') {
    if (isValidInt(query.background_id)) {
      emblemBg.background_id = asInt(query.background_id as string);
    } else {
      errors.push(`invalid background_id: "${query.background_id}"`);
    }
  }

  if (query.background_color_id !== '') {
    if (isValidInt(query.background_color_id)) {
      emblemBg.background_color_id = asInt(query.background_color_id as string);
    } else {
      errors.push(`invalid background_color_id: "${query.background_color_id}"`);
    }
  }

  if (isValidBool(query.flags_flip_bg_horizontal)) {
    emblemBg.flags_flip_bg_horizontal = asBool(query.flags_flip_bg_horizontal as string);
  } else {
    errors.push(`invalid flags_flip_bg_horizontal: "${query.flags_flip_bg_horizontal}"`);
  }

  if (isValidBool(query.flags_flip_bg_vertical)) {
    emblemBg.flags_flip_bg_vertical = asBool(query.flags_flip_bg_vertical as string);
  } else {
    errors.push(`invalid flags_flip_bg_vertical: "${query.flags_flip_bg_vertical}"`);
  }

  return { errors, emblemBg };
};

export const getValidatedFgParams = (
  query: NextApiRequestQuery
): { errors: string[]; emblemFg: IGuildEmblemForeground } => {
  const emblemFg: IGuildEmblemForeground = {};
  const errors = [];

  if (has(query, 'size') && query.size !== undefined) {
    if (isValidInt(query.size)) {
      emblemFg.size = asInt(query.size as string);
    } else {
      errors.push(`invalid size: "${query.size}"`);
    }
  }

  if (has(query, 'foreground_id') && query.foreground_id !== '') {
    if (isValidInt(query.foreground_id)) {
      emblemFg.foreground_id = asInt(query.foreground_id as string);
    } else {
      errors.push(`invalid foreground_id: "${query.foreground_id}"`);
    }
  }

  if (query.foreground_primary_color_id !== '') {
    if (isValidInt(query.foreground_primary_color_id)) {
      emblemFg.foreground_primary_color_id = asInt(query.foreground_primary_color_id as string);
    } else {
      errors.push(`invalid foreground_primary_color_id: "${query.foreground_primary_color_id}"`);
    }
  }

  if (query.foreground_secondary_color_id !== '') {
    if (isValidInt(query.foreground_secondary_color_id)) {
      emblemFg.foreground_secondary_color_id = asInt(query.foreground_secondary_color_id as string);
    } else {
      errors.push(`invalid foreground_secondary_color_id: "${query.foreground_secondary_color_id}"`);
    }
  }

  if (isValidBool(query.flags_flip_fg_horizontal)) {
    emblemFg.flags_flip_fg_horizontal = asBool(query.flags_flip_fg_horizontal as string);
  } else {
    errors.push(`invalid flags_flip_fg_horizontal: "${query.flags_flip_fg_horizontal}"`);
  }

  if (isValidBool(query.flags_flip_fg_vertical)) {
    emblemFg.flags_flip_fg_vertical = asBool(query.flags_flip_fg_vertical as string);
  } else {
    errors.push(`invalid flags_flip_fg_vertical: "${query.flags_flip_fg_vertical}"`);
  }

  return { errors, emblemFg };
};

export const truthyBoolValues = [undefined, '', 'true', '1'];
export const falseyBoolValues = ['false', '0'];
export const validBoolValues = [...truthyBoolValues, ...falseyBoolValues];

export const isValidInt = (id: string | string[]): boolean => !Array.isArray(id) && /^\d+$/.test(id);
export const asInt = (id: string): number => toSafeInteger(Number(id));
export const isValidBool = (bool: string | string[]): boolean => !Array.isArray(bool) && validBoolValues.includes(bool);
export const asBool = (bool?: string): boolean => truthyBoolValues.includes(bool);

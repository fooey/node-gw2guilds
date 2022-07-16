import { IGuildEmblem, IGuildEmblemBackground, IGuildEmblemForeground } from '~/types/Guild';
import { compactObject } from '../object';

export const getBgParams = (emblem: IGuildEmblemBackground, size: string): URLSearchParams => {
  const background_id = emblem.background_id?.toString() ?? undefined;
  const background_color_id = emblem.background_color_id?.toString() ?? undefined;
  const flags_flip_bg_horizontal = !!emblem.flags_flip_bg_horizontal ? '' : undefined;
  const flags_flip_bg_vertical = !!emblem.flags_flip_bg_vertical ? '' : undefined;
  const flags_bg_shadow = !!emblem.flags_bg_shadow ? '' : undefined;

  const compactParams = compactObject({
    size: size === '256' ? undefined : size,
    background_id,
    background_color_id,
    flags_flip_bg_horizontal,
    flags_flip_bg_vertical,
    flags_bg_shadow,
  });

  return new URLSearchParams(compactParams);
};

export const getFgParams = (emblem: IGuildEmblemForeground, size: string): URLSearchParams => {
  const foreground_id = emblem.foreground_id?.toString() ?? undefined;
  const foreground_primary_color_id = emblem.foreground_primary_color_id?.toString() ?? undefined;
  const foreground_secondary_color_id = emblem.foreground_secondary_color_id?.toString() ?? undefined;
  const flags_flip_fg_horizontal = !!emblem.flags_flip_fg_horizontal ? '' : undefined;
  const flags_flip_fg_vertical = !!emblem.flags_flip_fg_vertical ? '' : undefined;
  const flags_fg_shadow = !!emblem.flags_fg_shadow ? '' : undefined;

  return new URLSearchParams(
    compactObject({
      size: size === '256' ? undefined : size,
      foreground_id,
      foreground_primary_color_id,
      foreground_secondary_color_id,
      flags_flip_fg_horizontal,
      flags_flip_fg_vertical,
      flags_fg_shadow,
    })
  );
};

export const getBgUrl = (emblem: IGuildEmblem, size: string): string => {
  return getEmblemUrl(
    {
      ...emblem,
      foreground_id: undefined,
      foreground_primary_color_id: undefined,
      foreground_secondary_color_id: undefined,
      flags_flip_fg_horizontal: undefined,
      flags_flip_fg_vertical: undefined,
    },
    size
  );
};

export const getFgUrl = (emblem: IGuildEmblem, size: string): string => {
  return getEmblemUrl(
    {
      ...emblem,
      background_id: undefined,
      background_color_id: undefined,
      flags_flip_bg_horizontal: undefined,
      flags_flip_bg_vertical: undefined,
    },
    size
  );
};

export const getEmblemParams = (emblem: IGuildEmblem, size: string): URLSearchParams => {
  const fgParams = getFgParams(emblem, size);
  const bgParams = getBgParams(emblem, size);

  const compactParams = compactObject({
    ...Object.fromEntries(fgParams),
    ...Object.fromEntries(bgParams),
  });

  return new URLSearchParams(compactParams);
};

export const getEmblemUrl = (emblem: IGuildEmblem, size: string): string => {
  const emblemParams = getEmblemParams(emblem, size);
  return `/api/emblem?${emblemParams.toString()}`;
};

export interface IGuildEmblemBackground {
  size?: number;
  bg_color?: string;
  background_id?: number;
  background_color_id?: number;
  flags_flip_bg_horizontal?: boolean;
  flags_flip_bg_vertical?: boolean;
  flags_bg_shadow?: boolean;
}
export interface IGuildEmblemForeground {
  size?: number;
  foreground_id?: number;
  foreground_primary_color_id?: number;
  foreground_secondary_color_id?: number;
  flags_flip_fg_horizontal?: boolean;
  flags_flip_fg_vertical?: boolean;
  flags_fg_shadow?: boolean;
}

export type IGuildEmblem = IGuildEmblemBackground & IGuildEmblemForeground;

export interface IGuild extends IGuildEmblem {
  guild_id: string;
  guild_name: string;
  slug: string;
  tag: string;
}
export interface IGuildRecord extends IGuild {
  modified_count: string;
  modified_date: string;
  created_date: string;
  checked_date: string | null;
}

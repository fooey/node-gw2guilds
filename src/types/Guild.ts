export interface IGuildEmblemBackground {
  size?: number;
  background_id?: number;
  background_color_id?: number;
  flags_flip_bg_horizontal?: boolean;
  flags_flip_bg_vertical?: boolean;
}
export interface IGuildEmblemForeground {
  size?: number;
  foreground_id?: number;
  foreground_primary_color_id?: number;
  foreground_secondary_color_id?: number;
  flags_flip_fg_horizontal?: boolean;
  flags_flip_fg_vertical?: boolean;
}

export type IGuildEmblem = IGuildEmblemBackground & IGuildEmblemForeground;

export interface IGuild extends IGuildEmblem {
  guild_id: string;
  guild_name: string;
  slug: string;
  tag: string;
}
export interface IGuildRecord extends IGuild {
  modified_count: number;
  modified_date: number;
  created_date: number;
}

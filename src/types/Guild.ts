export interface IGuild {
  guild_id: string;
  guild_name: string;
  slug: string;
  tag: string;
  background_id: number;
  foreground_id: number;
  background_color_id: number;
  foreground_primary_color_id: number;
  foreground_secondary_color_id: number;
  flags_flip_bg_horizontal: number;
  flags_flip_bg_vertical: number;
  flags_flip_fg_horizontal: number;
  flags_flip_fg_vertical: number;
  modified_count: number;
  modified_date: number;
  created_date: number;
}

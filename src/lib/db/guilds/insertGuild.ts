import { IGuild } from '~/types/Guild';
import { db } from '../db';

const insertStatement = db.prepare<IGuild>(`
  INSERT INTO guilds (
    guild_id
    , guild_name
    , slug
    , tag
    , background_id
    , foreground_id
    , background_color_id
    , foreground_primary_color_id
    , foreground_secondary_color_id
    , flags_flip_bg_horizontal
    , flags_flip_bg_vertical
    , flags_flip_fg_horizontal
    , flags_flip_fg_vertical
    , modified_count
    , modified_date
    , created_date
    , checked_date
  )
  VALUES (
    @guild_id
    , @guild_name
    , @slug
    , @tag
    , @background_id
    , @foreground_id
    , @background_color_id
    , @foreground_primary_color_id
    , @foreground_secondary_color_id
    , @flags_flip_bg_horizontal
    , @flags_flip_bg_vertical
    , @flags_flip_fg_horizontal
    , @flags_flip_fg_vertical
    , 0
    , DATETIME()
    , DATETIME()
    , DATETIME()
  )
`);

export const insertGuild = (guild: IGuild) => {
  return insertStatement.run(guild);
};

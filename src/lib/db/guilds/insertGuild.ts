import { DateTime } from 'luxon';
import { IGuild } from '~/types/Guild';
import { db } from '../db';

const insertStatement = db.prepare(`
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
    , @now
    , @now
    , @now
  )
  ON CONFLICT(guild_id) DO UPDATE SET
    guild_name = @guild_name
    , slug = @slug
    , tag = @tag
    , background_id = @background_id
    , foreground_id = @foreground_id
    , background_color_id = @background_color_id
    , foreground_primary_color_id = @foreground_primary_color_id
    , foreground_secondary_color_id = @foreground_secondary_color_id
    , flags_flip_bg_horizontal = @flags_flip_bg_horizontal
    , flags_flip_bg_vertical = @flags_flip_bg_vertical
    , flags_flip_fg_horizontal = @flags_flip_fg_horizontal
    , flags_flip_fg_vertical = @flags_flip_fg_vertical
    , modified_count = modified_count + 1
    , modified_date = @now
    , checked_date = @now
`);

export const insertGuild = (guild: IGuild) => {
  const now = DateTime.utc().set({ millisecond: 0 }).toISO({ suppressMilliseconds: true });

  const bindable = {
    ...guild,
    guild_id: guild.guild_id.toLowerCase(),
    now,
    flags_flip_bg_horizontal: guild.flags_flip_bg_horizontal ? 1 : 0,
    flags_flip_bg_vertical: guild.flags_flip_bg_vertical ? 1 : 0,
    flags_flip_fg_horizontal: guild.flags_flip_fg_horizontal ? 1 : 0,
    flags_flip_fg_vertical: guild.flags_flip_fg_vertical ? 1 : 0,
  };

  return insertStatement.run(bindable);
};

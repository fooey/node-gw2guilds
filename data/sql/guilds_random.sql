SELECT
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
FROM
  guilds
WHERE
  guild_id IN (
    SELECT
      guild_id
    FROM
      guilds
    ORDER BY
      RANDOM()
    LIMIT
      10
  );

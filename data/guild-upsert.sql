INSERT INTO guilds as g (
   guild_id
   , guild_name
   , tag
   , slug

   , background_id
   , foreground_id
   , background_color_id
   , foreground_primary_color_id
   , foreground_secondary_color_id

   , flags_flip_bg_horizontal
   , flags_flip_bg_vertical
   , flags_flip_fg_horizontal
   , flags_flip_fg_vertical

   , modified_date
   , created_date
)
VALUES (
   $[guild_id]
   , $[guild_name]
   , $[tag]
   , $[slug]

   , $[background_id]
   , $[foreground_id]
   , $[background_color_id]
   , $[foreground_primary_color_id]
   , $[foreground_secondary_color_id]

   , $[flags_flip_bg_horizontal]
   , $[flags_flip_bg_vertical]
   , $[flags_flip_fg_horizontal]
   , $[flags_flip_fg_vertical]

   , $[now]
   , $[now]
)
ON CONFLICT (guild_id)
DO UPDATE
SET guild_name = EXCLUDED.guild_name
   , tag = EXCLUDED.tag
   , slug = EXCLUDED.slug
   , background_id = EXCLUDED.background_id
   , foreground_id = EXCLUDED.foreground_id
   , background_color_id = EXCLUDED.background_color_id
   , foreground_primary_color_id = EXCLUDED.foreground_primary_color_id
   , foreground_secondary_color_id = EXCLUDED.foreground_secondary_color_id

   , flags_flip_bg_horizontal = EXCLUDED.flags_flip_bg_horizontal
   , flags_flip_bg_vertical = EXCLUDED.flags_flip_bg_vertical
   , flags_flip_fg_horizontal = EXCLUDED.flags_flip_fg_horizontal
   , flags_flip_fg_vertical = EXCLUDED.flags_flip_fg_vertical

   , modified_count = g.modified_count + 1
   , modified_date = $[now]

-- public.guilds definition
-- Drop table
-- DROP TABLE guilds;
CREATE TABLE
  guilds (
    guild_id text NOT NULL
  , guild_name text NOT NULL
  , slug text NOT NULL
  , tag text NOT NULL
  , background_id integer NULL
  , foreground_id integer NULL
  , background_color_id integer NULL
  , foreground_primary_color_id integer NULL
  , foreground_secondary_color_id integer NULL
  , flags_flip_bg_horizontal integer NULL DEFAULT false
  , flags_flip_bg_vertical integer NULL DEFAULT false
  , flags_flip_fg_horizontal integer NULL DEFAULT false
  , flags_flip_fg_vertical integer NULL DEFAULT false
  , modified_count integer NOT NULL DEFAULT 0
  , modified_date integer NOT NULL
  , created_date integer NOT NULL
  , CONSTRAINT pk_guild_id PRIMARY KEY (guild_id)
  );

CREATE INDEX idx_guilds__background_id__date_last_modified ON guilds (background_id, modified_date);

CREATE INDEX idx_guilds__date_last_modified ON guilds (modified_date);

CREATE INDEX idx_guilds__slug ON guilds (slug);

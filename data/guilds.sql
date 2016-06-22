
	DROP TABLE IF EXISTS guilds;

	CREATE TABLE guilds (
		guild_id UUID NOT NULL
		, guild_name TEXT NOT NULL
		, slug TEXT NOT NULL
		, tag TEXT NOT NULL
		, background_id INTEGER
		, foreground_id INTEGER
		, background_color_id INTEGER
		, foreground_primary_color_id INTEGER
		, foreground_secondary_color_id INTEGER
		, flags_flip_bg_horizontal BOOLEAN DEFAULT false
		, flags_flip_bg_vertical BOOLEAN DEFAULT false
		, flags_flip_fg_horizontal BOOLEAN DEFAULT false
		, flags_flip_fg_vertical BOOLEAN DEFAULT false
		, date_created TIMESTAMP(0) NOT NULL DEFAULT now()
		, date_modified TIMESTAMP(0) NOT NULL DEFAULT now()
		, date_last_seen TIMESTAMP(0) NOT NULL DEFAULT now()
		, CONSTRAINT pk_guild_id PRIMARY KEY (guild_id)
	);

-- 	CREATE INDEX idx_guilds__guild_id ON guilds (guild_id);
	CREATE INDEX idx_guilds__slug ON guilds (slug);
	CREATE INDEX idx_guilds__date_last_seen ON guilds (slug);

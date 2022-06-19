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
	, modified_count INTEGER NOT NULL DEFAULT 0
	, modified_date INTEGER NOT NULL
	, created_date INTEGER NOT NULL
	, CONSTRAINT pk_guild_id PRIMARY KEY (guild_id)
);

-- 	CREATE INDEX idx_guilds__guild_id ON guilds (guild_id);
CREATE INDEX idx_guilds__slug ON guilds (slug);
CREATE INDEX idx_guilds__date_last_modified ON guilds (modified_date);
CREATE INDEX idx_guilds__background_id__date_last_modified ON guilds (background_id, modified_date);

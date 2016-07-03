SELECT *
FROM guilds
WHERE guild_id = $[guildId]
    AND modified_date > $[maxAge];

SELECT *
FROM guilds
WHERE slug = $[guildSlug]
    AND modified_date > $[maxAge];

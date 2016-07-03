SELECT *
FROM guilds TABLESAMPLE BERNOULLI(1)
WHERE modified_date > $[maxAge]
    AND background_id IS NOT NULL
LIMIT $[limit];

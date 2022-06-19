select *
from guilds
order by date_created desc;

truncate table guilds;

--                 explain 
                SELECT *
                FROM guilds
                WHERE slug = 'arenanet';
                
--                 explain 
                SELECT *
                FROM guilds
                WHERE guild_id = '55C83169-5053-E511-A5A9-AC162DAE5A05';

                SELECT *
                FROM guilds
                order by modified_date desc
                LIMIT 100;

--                 explain 
                SELECT *
                FROM guilds
		TABLESAMPLE BERNOULLI(1)
                WHERE background_id IS NOT NULL
			AND modified_date >= 1467525312 - (1000 * 60 * 60)
                LIMIT 5;


select (SELECT count(*) FROM guilds),
	(SELECT reltuples AS approximate_row_count FROM pg_class WHERE relname = 'guilds');

	analyze;
	vacuum;
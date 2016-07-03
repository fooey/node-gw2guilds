select *
from guilds
order by date_created desc;

truncate table guilds;

                SELECT *
                FROM guilds
                WHERE slug = 'ring-of-fire-community-guild';
                
--                 explain 
                SELECT *
                FROM guilds
                WHERE guild_id = '55C83169-5053-E511-A5A9-AC162DAE5A05';


                SELECT CAST(EXTRACT(EPOCH FROM Now()) as INT);
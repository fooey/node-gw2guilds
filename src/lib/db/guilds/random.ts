import { DateTime } from 'luxon';
import { db } from '~/lib/db/db';
import { IGuild } from '~/types/Guild';

const sqlStatement = db.prepare(`
  SELECT *
  FROM guilds
  WHERE guild_id IN (
    SELECT guild_id
    FROM guilds
    WHERE background_id IS NOT NULL
      AND foreground_id IS NOT NULL
      AND modified_date > date(@date)
    ORDER BY RANDOM()
    LIMIT @limit
  );
`);

export const DEFAULT_RANDOM_GUILDS_NUM = 20;
const MAX_LIMIT = 100;

export const lookupRandomGuilds = (num: number = DEFAULT_RANDOM_GUILDS_NUM): IGuild[] => {
  const date = DateTime.utc().minus({ days: 30 });
  const limit = Math.min(num, MAX_LIMIT);
  const guilds: IGuild[] = sqlStatement.all({ limit, date: date.toISODate() });

  return guilds;
};

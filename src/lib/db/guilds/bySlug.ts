import { DateTime } from 'luxon';
import { db } from '~/lib/db/db';
import { IGuildRecord } from '~/types/Guild';

const sqlStatement = db.prepare<{ slug: string }>(`
  SELECT *
  FROM guilds
  WHERE slug = @slug
`);

export const lookupGuildBySlug = async (slug: string): Promise<IGuildRecord> => {
  const maxAge = DateTime.utc().minus({ hour: 1 });
  const guild: IGuildRecord | undefined = sqlStatement.get({ slug });

  // if (guild === undefined || guild.checked_date === null || DateTime.fromISO(guild.checked_date) < maxAge) {
  //   const { data } = await retrieveGuildIdByNameV2(slug);
  //   console.log(`🚀 ~ file: bySlug.ts ~ line 19 ~ lookupGuildBySlug ~ data`, data);
  //   return {} as unknown as IGuildRecord;
  // } else {
  //   return guild;
  // }

  return guild!;
};

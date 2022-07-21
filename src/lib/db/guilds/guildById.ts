import { DateTime } from 'luxon';
import { db } from '~/lib/db/db';
import { IGuildRecord } from '~/types/Guild';

const selectByIdStatement = db.prepare(`
  SELECT *
  FROM guilds
  WHERE guild_id = lower(@guild_id)
`);

export const lookupGuildById = async (guild_id: string): Promise<IGuildRecord | undefined> => {
  const guild: IGuildRecord | undefined = selectByIdStatement.get({ guild_id });

  // if (guild === undefined || guild.checked_date === null || isStale(guild.checked_date)) {
  //   const { data } = await retrieveGuildIdByNameV2(slug);

  //   if (data) {
  //     const apiGuild = apiResultToGuild(data);

  //     if (!guild) {
  //       insertGuild(apiGuild);
  //       return apiGuild as unknown as IGuildRecord;
  //     } else {
  //       updateGuild(apiGuild);
  //       return apiGuild as unknown as IGuildRecord;
  //     }
  //   } else {
  //     return;
  //   }
  // }

  return guild;
};

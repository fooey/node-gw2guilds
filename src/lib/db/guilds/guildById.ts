import { getGuild, isStale } from '~/lib/api/api';
import { idCache } from '~/lib/cache/id';
import { db } from '~/lib/db/db';
import { IGuildRecord } from '~/types/Guild';
import { insertGuild } from './insertGuild';
import { updateGuild } from './updateGuild';

const selectByIdStatement = db.prepare(`
  SELECT *
  FROM guilds
  WHERE guild_id = lower(@guild_id)
`);

export const selectGuildById = (guild_id: string): IGuildRecord | undefined => selectByIdStatement.get({ guild_id });

export const lookupGuildById = async (guild_id: string): Promise<IGuildRecord | undefined> => {
  if (idCache.has(guild_id)) {
    return Promise.reject('NotFound');
  }

  const guild = selectGuildById(guild_id);

  if (guild === undefined || isStale(guild)) {
    return getGuild(guild_id).then((guildData) => {
      if (guildData) {
        if (!guild) {
          insertGuild(guildData);
        } else {
          updateGuild(guildData);
        }

        return lookupGuildById(guildData.guild_id);
      } else if (guild) {
        return guild;
      } else {
        idCache.set(guild_id, 404);
        return Promise.reject(`NotFound`);
      }
    });
  }

  return Promise.resolve(guild);
};

import { nameCache } from '~/lib/cache/name';
import { db } from '~/lib/db/db';
import { deslugify, slugify } from '~/lib/string';
import { IGuildRecord } from '~/types/Guild';
import { guildSearch, isStale } from '../../api/api';
import { lookupGuildById } from './guildById';
import { insertGuild } from './insertGuild';
import { updateGuild } from './updateGuild';

const selectBySlugStatement = db.prepare<{ slug: string }>(`
  SELECT *
  FROM guilds
  WHERE slug = @slug
`);

export const lookupGuildBySlug = async (slug: string): Promise<IGuildRecord | undefined> => {
  const unslug = encodeURIComponent(deslugify(slug));

  if (nameCache.has(unslug)) {
    return Promise.reject(`NotFound`);
  }

  const guild: IGuildRecord | undefined = selectBySlugStatement.get({ slug: slugify(slug) });

  if (guild === undefined || isStale(guild)) {
    return guildSearch(unslug).then((guildData) => {
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
        nameCache.set(unslug, 404);
        return Promise.reject(`NotFound`);
      }
    });
  }

  return Promise.resolve(guild);
};

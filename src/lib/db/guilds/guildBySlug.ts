import { db } from '~/lib/db/db';
import { slugify } from '~/lib/string';
import { IGuildRecord } from '~/types/Guild';
import { apiResultToGuild, isStale, retrieveGuildIdByNameV2 } from './api';
import { lookupGuildById } from './guildById';
import { insertGuild } from './insertGuild';
import { updateGuild } from './updateGuild';

const selectBySlugStatement = db.prepare<{ slug: string }>(`
  SELECT *
  FROM guilds
  WHERE slug = @slug
`);

export const lookupGuildBySlug = async (slug: string): Promise<IGuildRecord | undefined> => {
  const guild: IGuildRecord | undefined = selectBySlugStatement.get({ slug: slugify(slug) });

  if (guild === undefined || isStale(guild)) {
    console.log(`🚀 ~ file: guildBySlug.ts ~  lookupGuildBySlug ~ miss`, { slug });
    return retrieveGuildIdByNameV2(slug).then(({ data }) => {
      if (data) {
        const apiGuild = apiResultToGuild(data);

        if (!guild) {
          insertGuild(apiGuild);
        } else {
          updateGuild(apiGuild);
        }

        return lookupGuildById(apiGuild.guild_id);
      } else if (guild) {
        return guild;
      } else {
        return Promise.reject(`NotFound`);
      }
    });
  }
  console.log(`🚀 ~ file: guildBySlug.ts ~  lookupGuildBySlug ~ hit`, { slug });

  return guild;
};

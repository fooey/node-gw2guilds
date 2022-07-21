import axios from 'axios';
import { DateTime } from 'luxon';
import { deslugify, slugify } from '~/lib/string';
import { IGuild, IGuildRecord } from '~/types/Guild';

const API_KEY = process.env.API_KEY;

// Add a request interceptor
// axios.interceptors.request.use(
//   function (config) {
//     // Do something before request is sent
//     console.log('Starting Request', JSON.stringify(config, null, 2));
//     return config;
//   },
//   function (error) {
//     console.log('request error', JSON.stringify(error, null, 2));
//     // Do something with request error
//     return Promise.reject(error);
//   }
// );

// Add a response interceptor
// axios.interceptors.response.use(
//   function (response) {
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     // console.log('Response:', JSON.stringify(response.data, null, 2));
//     return response;
//   },
//   function (error) {
//     // Any status codes that falls outside the range of 2xx cause this function to trigger
//     // Do something with response error
//     console.log('Response Error:', JSON.stringify(error, null, 2));
//     return Promise.reject(error);
//   }
// );

export const gw2api = axios.create({
  baseURL: `https://api.guildwars2.com`,
  headers: {
    ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
    'User-Agent': 'guilds.gw2w2w.com',
  },
});

export const retrieveGuildIdByNameV2 = (slug: string) => {
  const unslug = encodeURIComponent(deslugify(slug));
  console.log(`🚀 ~ file: bySlug.ts ~ line 25 ~ lookupGuildBySlugV2 ~ unslug`, {
    slug,
    unslug,
    slugified: slugify(slug),
  });
  return gw2api
    .request<string[]>({
      method: 'GET',
      url: `/v2/guild/search?name=${unslug}`,
    })
    .then(({ data }) => data)
    .then((data) => {
      console.log(`🚀 ~ file: api.ts ~ line 54 ~ .then ~ data`, data);
      const [guildId] = data;
      if (!guildId) {
        throw new Error('guild not fo und');
      }

      return retrieveGuildIdByIdV2(guildId);
    });
};

interface IApiGuildEmblem {
  background: IApiGuildEmblemLayer;
  foreground: IApiGuildEmblemLayer;
  flags: string[];
}
interface IApiGuildEmblemLayer {
  id: number;
  colors: number[];
}

export interface IApiGuild {
  id: string;
  name: string;
  tag: string;
  emblem: IApiGuildEmblem;
}

export const retrieveGuildIdByIdV2 = (id: string) => {
  console.log(`🚀 ~ file: bySlug.ts ~ line 36 ~ retrieveGuildIdByIdV2 ~ id`, id);

  return gw2api.request<IApiGuild>({ method: 'GET', url: `/v2/guild/${id}` });
};

export const apiResultToGuild = (apiGuild: IApiGuild): IGuild => {
  return {
    guild_id: apiGuild.id,
    guild_name: apiGuild.name,
    tag: apiGuild.tag,
    slug: slugify(apiGuild.name),
    background_id: apiGuild.emblem.background.id,
    background_color_id: apiGuild.emblem.background.colors[0],
    foreground_id: apiGuild.emblem.foreground.id,
    foreground_primary_color_id: apiGuild.emblem.foreground.colors[0],
    foreground_secondary_color_id: apiGuild.emblem.foreground.colors[1],
    flags_flip_bg_horizontal: apiGuild.emblem.flags.includes('FlipBackgroundHorizontal '),
    flags_flip_bg_vertical: apiGuild.emblem.flags.includes('FlipBackgroundVertical '),
    flags_flip_fg_horizontal: apiGuild.emblem.flags.includes('FlipForegoundHorizontal'),
    flags_flip_fg_vertical: apiGuild.emblem.flags.includes('FlipForegoundVertical'),
  };
};

export const isStale = (guild: IGuildRecord): boolean => {
  return !guild.checked_date || DateTime.fromISO(guild.checked_date) < DateTime.utc().minus({ hours: 4 });
};

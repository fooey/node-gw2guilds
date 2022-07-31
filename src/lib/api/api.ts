import axios from 'axios';
import { isEmpty, random } from 'lodash';
import { DateTime } from 'luxon';
import { slugify } from '~/lib/string';
import { IGuild, IGuildRecord } from '~/types/Guild';
import { idCache } from '../cache/id';
import { nameCache } from '../cache/name';
import { IApiGuild } from './types';

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

export const guildSearch = (unslug: string) => {
  return gw2api
    .request<string[]>({
      method: 'GET',
      url: `/v2/guild/search?name=${unslug}`,
    })
    .then(({ data }) => data)
    .then((data) => {
      if (isEmpty(data)) {
        nameCache.set(unslug, 404);
        return Promise.reject('NotFound');
      } else if (data.length !== 1) {
        nameCache.set(unslug, 500);
        return Promise.reject('Too many results found');
      }
      return getGuild(data[0]);
    });
};

export const getGuild = async (id: string) => {
  if (idCache.has(id)) {
    return Promise.reject('NotFound');
  }

  return gw2api.request<IApiGuild>({ method: 'GET', url: `/v2/guild/${id}` }).then((response) => {
    const { data, status } = response;
    if (status === 404) {
      idCache.set(id, status);
      throw Error('NotFound');
    }
    return apiResultToGuild(data);
  });
};

export const apiResultToGuild = (apiGuild: IApiGuild): IGuild => {
  const { emblem } = apiGuild;

  return {
    guild_id: apiGuild.id,
    guild_name: apiGuild.name,
    tag: apiGuild.tag,
    slug: slugify(apiGuild.name),
    background_id: emblem?.background.id,
    background_color_id: emblem?.background.colors[0],
    foreground_id: emblem?.foreground.id,
    foreground_primary_color_id: emblem?.foreground.colors[0],
    foreground_secondary_color_id: emblem?.foreground.colors[1],
    flags_flip_bg_horizontal: emblem?.flags.includes('FlipBackgroundHorizontal '),
    flags_flip_bg_vertical: emblem?.flags.includes('FlipBackgroundVertical '),
    flags_flip_fg_horizontal: emblem?.flags.includes('FlipForegroundHorizontal'),
    flags_flip_fg_vertical: emblem?.flags.includes('FlipForegroundVertical'),
  };
};

const getStaleCutoff = () => {
  const base = DateTime.utc().minus({ hours: 4 });
  const jitter = random(-15, 15);

  return base.plus({ minutes: jitter });
};

export const isStale = (guild: IGuildRecord): boolean => {
  return !guild.checked_date || DateTime.fromISO(guild.checked_date) < getStaleCutoff();
};;

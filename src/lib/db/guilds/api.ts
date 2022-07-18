import axios from 'axios';
import { deslugify } from '~/lib/string';

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
  console.log(`🚀 ~ file: bySlug.ts ~ line 25 ~ lookupGuildBySlugV2 ~ unslug`, unslug);
  return gw2api.get<string[]>(`/v2/guild/search?name=${unslug}`).then((response) => {
    const [guildId] = response.data;
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

interface IApiGuild {
  id: string;
  name: string;
  tag: string;
  emblem: IApiGuildEmblem;
}

export const retrieveGuildIdByIdV2 = (id: string) => {
  console.log(`🚀 ~ file: bySlug.ts ~ line 36 ~ retrieveGuildIdByIdV2 ~ id`, id);

  return gw2api.get<IApiGuild>(`/v2/guild/${id}`);
};

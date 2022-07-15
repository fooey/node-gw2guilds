import type { NextApiResponse } from 'next';
import { NextApiRequestQuery } from 'next/dist/server/api-utils';
import { DEFAULT_RANDOM_GUILDS_NUM, lookupRandomGuilds } from '~/lib/db/guilds/random';
import { NextApiRequestWithQuery } from '~/types/next';

export interface IQueryParams extends NextApiRequestQuery {
  num: string | string[];
}

export const defaultParams: IQueryParams = {
  num: DEFAULT_RANDOM_GUILDS_NUM.toString(),
};

const handler = (req: NextApiRequestWithQuery<IQueryParams>, res: NextApiResponse) => {
  const query = { ...defaultParams, ...req.query };

  if (Array.isArray(query.num)) {
    return res.status(400).end('num must be a single number');
  }

  const numInt = parseInt(query.num, 10);

  return res.status(200).json(lookupRandomGuilds(numInt));
};

export default handler;

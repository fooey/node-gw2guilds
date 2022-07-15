import type { NextApiRequest } from 'next';
import { NextApiRequestQuery } from 'next/dist/server/api-utils';

export interface NextApiRequestWithQuery<T extends NextApiRequestQuery> extends NextApiRequest {
  query: T;
}

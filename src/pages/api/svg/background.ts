import type { NextApiRequest, NextApiResponse } from 'next';
import { NextApiRequestQuery } from 'next/dist/server/api-utils';
import ReactDOMServer from 'react-dom/server';
import { getValidatedBgParams } from '~/lib/emblem/api';
import { Emblem } from '~/lib/emblem/Emblem';
import { setSvgHeaders } from './emblem';

interface IQueryParams extends NextApiRequestQuery {
  size: string | string[];
  background_id: string | string[];
  background_color_id: string | string[];
  flags_flip_bg_horizontal: string | string[];
  flags_flip_bg_vertical: string | string[];
}

const defaultParams: IQueryParams = {
  size: '256',
  background_id: '',
  background_color_id: '',
  flags_flip_bg_horizontal: 'false',
  flags_flip_bg_vertical: 'false',
};

export interface NextApiRequestWithQuery<T extends NextApiRequestQuery> extends NextApiRequest {
  query: T;
}

const handler = (req: NextApiRequestWithQuery<IQueryParams>, res: NextApiResponse): NextApiResponse<string> => {
  const query = { ...defaultParams, ...req.query };

  const { errors, emblemBg } = getValidatedBgParams(query);

  if (errors.length > 0) {
    return res.status(400).end(errors.join('\n'));
  }

  setSvgHeaders(res);
  res.send(ReactDOMServer.renderToStaticMarkup(Emblem({ emblem: emblemBg })!));
  return res.end();
};

export default handler;

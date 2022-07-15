import type { NextApiResponse } from 'next';
import { NextApiRequestQuery } from 'next/dist/server/api-utils';
import * as ReactDOMServer from 'react-dom/server';
import { EmblemSVG } from '~/components/EmblemSVG';
import { getValidatedEmblemParams } from '~/lib/emblem/api';
import { NextApiRequestWithQuery } from '~/types/next';

export interface IQueryParams extends NextApiRequestQuery {
  size: string | string[];
  background_id: string | string[];
  foreground_id: string | string[];
  background_color_id: string | string[];
  foreground_primary_color_id: string | string[];
  foreground_secondary_color_id: string | string[];
  flags_flip_bg_horizontal: string | string[];
  flags_flip_bg_vertical: string | string[];
  flags_flip_fg_horizontal: string | string[];
  flags_flip_fg_vertical: string | string[];
  flags_bg_shadow: string | string[];
  flags_fg_shadow: string | string[];
}

export const defaultParams: IQueryParams = {
  size: '256',
  background_id: '',
  foreground_id: '',
  background_color_id: '',
  foreground_primary_color_id: '',
  foreground_secondary_color_id: '',
  flags_flip_bg_horizontal: 'false',
  flags_flip_bg_vertical: 'false',
  flags_flip_fg_horizontal: 'false',
  flags_flip_fg_vertical: 'false',
  flags_bg_shadow: 'false',
  flags_fg_shadow: 'false',
};

const handler = (req: NextApiRequestWithQuery<IQueryParams>, res: NextApiResponse): NextApiResponse<string> => {
  const query = { ...defaultParams, ...req.query };

  const { errors, emblem } = getValidatedEmblemParams(query);

  if (errors.length > 0) {
    return res.status(400).end(errors.join('\n'));
  }

  setSvgHeaders(res);
  res.send(ReactDOMServer.renderToStaticMarkup(EmblemSVG({ emblem })!));
  return res.end();
};

export const setSvgHeaders = (res: NextApiResponse) => {
  res.setHeader('content-type', 'image/svg+xml');
  res.setHeader('cache-control', 'public, max-age=86400');
};

export default handler;

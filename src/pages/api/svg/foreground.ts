import type { NextApiRequest, NextApiResponse } from 'next';
import { NextApiRequestQuery } from 'next/dist/server/api-utils';
import { getValidatedFgParams } from '~/lib/emblem/api';
import { renderEmblem } from '~/lib/emblem/render';
import { setSvgHeaders } from './emblem';

interface IQueryParams extends NextApiRequestQuery {
  size: string | string[];
  foreground_id: string | string[];
  foreground_primary_color_id: string | string[];
  foreground_secondary_color_id: string | string[];
  flags_flip_fg_horizontal: string | string[];
  flags_flip_fg_vertical: string | string[];
}

const defaultParams: IQueryParams = {
  size: '256',
  foreground_id: '',
  foreground_primary_color_id: '',
  foreground_secondary_color_id: '',
  flags_flip_fg_horizontal: 'false',
  flags_flip_fg_vertical: 'false',
};

export interface NextApiRequestWithQuery<T extends NextApiRequestQuery> extends NextApiRequest {
  query: T;
}

const handler = (req: NextApiRequestWithQuery<IQueryParams>, res: NextApiResponse): NextApiResponse<string> => {
  const query = { ...defaultParams, ...req.query };

  const { errors, emblemFg } = getValidatedFgParams(query);

  if (errors.length > 0) {
    return res.status(400).end(errors.join('\n'));
  }

  setSvgHeaders(res);
  res.send(
    renderEmblem({
      background_id: 1,
      ...emblemFg,
    })
  );
  return res.end();
};

export default handler;

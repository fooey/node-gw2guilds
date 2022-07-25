// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs';
import { DateTime } from 'luxon';
import type { NextApiRequest, NextApiResponse } from 'next';
import { dbFilePath } from '~/lib/db/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const now = DateTime.utc().set({ millisecond: 0 }).toISO({ suppressMilliseconds: true });
  const fileName = `backup-${now}.db.sqlite`;

  const readStream = fs.createReadStream(dbFilePath);
  const stat = fs.statSync(dbFilePath);

  res.setHeader('content-type', 'application/unknown');
  res.setHeader('content-length', stat.size);
  res.setHeader('content-disposition', `attachment; filename=${fileName}`);

  readStream.pipe(res);
  readStream.on('end', () => res.end());
}

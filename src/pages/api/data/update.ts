import path from 'path';
const API_KEY = process.env.API_KEY;

const dataFilePath = path.resolve(process.cwd(), 'assets');

interface Resource {
  name: string;
  url: string;
  json?: string;
}

const datasources: Resource[] = [
  { name: 'emblem-foregrounds', url: '/v2/emblem/foregrounds?ids=all' },
  { name: 'emblem-backgrounds', url: '/v2/emblem/backgrounds?ids=all' },
  { name: 'colors', url: '/v2/colors?ids=all' },
];

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { writeFileSync } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { gw2api } from '~/lib/api/api';

type ResponseData = Resource[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const resources = await Promise.all(
    datasources.map(async (resource) => {
      const json = await gw2api.get(resource.url).then((response) => response.data);

      const resourceWithData = {
        ...resource,
        json,
      };

      return resourceWithData;
    })
  );

  resources.forEach((resource) => {
    const filePath = path.resolve(dataFilePath, `${resource.name}.json`);
    console.log(`🚀 ~ file: update.ts ~ line 39 ~ resources.forEach ~ filePath`, filePath);
    writeFileSync(filePath, JSON.stringify(resource.json, null, 2));
  });

  res.json(resources);
}

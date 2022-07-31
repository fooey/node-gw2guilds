import path from 'path';
import prettier from 'prettier';

const dataFilePath = path.resolve(process.cwd(), 'data');

interface Resource {
  name: string;
  url: string;
  json?: string;
}

const datasources: Resource[] = [
  { name: 'emblem-foregrounds', url: 'https://api.guildwars2.com/v2/emblem/foregrounds?ids=all' },
  { name: 'emblem-backgrounds', url: 'https://api.guildwars2.com/v2/emblem/backgrounds?ids=all' },
  { name: 'colors', url: 'https://api.guildwars2.com/v2/colors?ids=all' },
];

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { writeFileSync } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = Resource[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const resources = await Promise.all(
    datasources.map(async (resource) => {
      const json = await fetch(resource.url).then((response) => response.text());

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

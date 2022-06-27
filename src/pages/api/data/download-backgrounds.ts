import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

const dataPath = path.resolve(process.cwd(), `data`);
const rawDataPath = path.resolve(dataPath, `raw`, `emblem-backgrounds`);
const fileName = path.resolve(dataPath, `emblem-backgrounds.json`);
const backgrounds = JSON.parse(readFileSync(fileName).toString()) as Background[];

if (!existsSync(rawDataPath)) {
  mkdirSync(rawDataPath, { recursive: true });
}

interface Background {
  id: number;
  layers: string[];
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

type ResponseData = any[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  backgrounds.forEach(async (background) => {
    background.layers.forEach(async (layer, ixLayer) => {
      const fileName = `${background.id}-${ixLayer}.png`;
      const filePath = path.resolve(rawDataPath, fileName);
      const response = await fetch(layer);
      const data = await response.arrayBuffer();

      writeFileSync(filePath, Buffer.from(data));
    });
  });

  res.json(backgrounds);
}

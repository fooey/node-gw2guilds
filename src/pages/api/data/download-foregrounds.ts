import type { NextApiRequest, NextApiResponse } from 'next';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

const dataPath = path.resolve(process.cwd(), `assets`);
const rawDataPath = path.resolve(dataPath, `emblem-foregrounds`);
const fileName = path.resolve(dataPath, `emblem-foregrounds.json`);
const foregrounds = JSON.parse(readFileSync(fileName).toString()) as Background[];

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
  foregrounds.forEach(async (foreground) => {
    foreground.layers.forEach(async (layer, ixLayer) => {
      const fileName = `${foreground.id}-${ixLayer}.png`;
      const filePath = path.resolve(rawDataPath, fileName);
      const response = await fetch(layer);
      const data = await response.arrayBuffer();

      writeFileSync(filePath, Buffer.from(data));
    });
  });

  res.json(foregrounds);
}

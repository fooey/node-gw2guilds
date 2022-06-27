import ImageTracer from 'imagetracerjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import PNG from 'pngjs';

const dataPath = path.resolve(process.cwd(), `data`);
const rawDataPath = path.resolve(dataPath, `raw`, `emblem-backgrounds`);
const convertedDataPath = path.resolve(dataPath, `raw`, `emblem-backgrounds`, `svg`);
const fileName = path.resolve(dataPath, `emblem-backgrounds.json`);
const backgrounds = JSON.parse(readFileSync(fileName).toString()) as Background[];

if (!existsSync(rawDataPath)) {
  mkdirSync(rawDataPath, { recursive: true });
}
if (!existsSync(convertedDataPath)) {
  mkdirSync(convertedDataPath, { recursive: true });
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
      const sourceFileName = `${background.id}-${ixLayer}.png`;
      const sourceFilePath = path.resolve(rawDataPath, sourceFileName);
      console.log(
        `🚀 ~ file: convert-backgrounds.ts ~ line 30 ~ background.layers.forEach ~ sourceFilePath`,
        sourceFilePath
      );

      const outputFileName = `${background.id}-${ixLayer}.svg`;
      const outputFilePath = path.resolve(convertedDataPath, outputFileName);

      const imageBuffer = readFileSync(sourceFilePath);
      const img = PNG.PNG.sync.read(imageBuffer);
      const svgString = ImageTracer.imagedataToSVG(img, 'artistic4');
      writeFileSync(outputFilePath, svgString);
    });
  });

  res.json(backgrounds);
}

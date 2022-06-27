import ImageTracer from 'imagetracerjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import PNG from 'pngjs';

const dataPath = path.resolve(process.cwd(), `data`);
const rawDataPath = path.resolve(dataPath, `raw`, `emblem-foregrounds`);
const convertedDataPath = path.resolve(dataPath, `raw`, `emblem-foregrounds`, `svg`);
const fileName = path.resolve(dataPath, `emblem-foregrounds.json`);
const foregrounds = JSON.parse(readFileSync(fileName).toString()) as Foreground[];

if (!existsSync(rawDataPath)) {
  mkdirSync(rawDataPath, { recursive: true });
}
if (!existsSync(convertedDataPath)) {
  mkdirSync(convertedDataPath, { recursive: true });
}

interface Foreground {
  id: number;
  layers: string[];
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

type ResponseData = any[];

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  foregrounds.forEach(async (foreground) => {
    foreground.layers.forEach(async (layer, ixLayer) => {
      const sourceFileName = `${foreground.id}-${ixLayer}.png`;
      const sourceFilePath = path.resolve(rawDataPath, sourceFileName);
      console.log(
        `🚀 ~ file: convert-foregrounds.ts ~ line 30 ~ foreground.layers.forEach ~ sourceFilePath`,
        sourceFilePath
      );

      const outputFileName = `${foreground.id}-${ixLayer}.svg`;
      const outputFilePath = path.resolve(convertedDataPath, outputFileName);

      const imageBuffer = readFileSync(sourceFilePath);
      const img = PNG.PNG.sync.read(imageBuffer);
      const svgString = ImageTracer.imagedataToSVG(img, 'fixedpalette');
      writeFileSync(outputFilePath, svgString);
    });
  });

  res.json(foregrounds);
}

import ReactDOMServer from 'react-dom/server';
import { EmblemSVG } from '~/components/EmblemSVG';
import { IGuildEmblem } from '~/types/Guild';

export const downloadEmblemBinary = (emblem: IGuildEmblem, imageType: 'png' | 'webp') => {
  const size = emblem.size ?? 512;
  const svg = ReactDOMServer.renderToStaticMarkup(EmblemSVG({ emblem })!);
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const blobURL = URL.createObjectURL(blob);

  const image = new Image();
  image.onload = () => {
    const imageData = convertImage(image, size, `image/${imageType}`);
    const imageName = `image-${Date.now()}.${imageType}`;

    downloadFile(imageData, imageName);
  };
  image.src = blobURL;
};

const convertImage = (img: HTMLImageElement, size: number, mimeType: string) => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext('2d')!;
  context.drawImage(img, 0, 0, size, size);

  return canvas.toDataURL(mimeType, 1);
};

export const downloadFile = (href: string, name: string) => {
  const link = document.createElement('a');
  link.download = name;
  link.target = '_blank';
  link.style.opacity = '0';
  document.body.append(link);
  link.href = href;
  link.click();
  link.remove();
};

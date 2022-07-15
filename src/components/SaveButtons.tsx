import React from 'react';
import { MdDownload } from 'react-icons/md';
import { downloadEmblemBinary } from '~/lib/web';
import { IGuildEmblem } from '~/types/Guild';

interface ISaveButtonsProps {
  emblem: IGuildEmblem;
  src: string;
}
export const SaveButtons: React.FC<ISaveButtonsProps> = ({ src, emblem }) => (
  <>
    <a
      className="inline-flex w-fit items-center justify-center gap-2 rounded border bg-blue-500 py-2 px-3 text-sm text-white"
      href={src}
      download="emblem.svg"
    >
      <MdDownload />
      <span>SVG</span>
    </a>
    <button
      className="inline-flex w-fit items-center justify-center gap-2 rounded border bg-blue-500 py-2 px-3 text-sm text-white"
      onClick={(e) => downloadEmblemBinary(emblem, 'png')}
    >
      <MdDownload />
      <span>PNG</span>
    </button>
    <button
      className="inline-flex w-fit items-center justify-center gap-2 rounded border bg-blue-500 py-2 px-3 text-sm text-white"
      onClick={(e) => downloadEmblemBinary(emblem, 'webp')}
    >
      <MdDownload />
      <span>WebP</span>
    </button>
  </>
);

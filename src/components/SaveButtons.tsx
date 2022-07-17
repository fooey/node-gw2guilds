import React from 'react';
import { MdDownload } from 'react-icons/md';
import { getEmblemUrl } from '~/lib/emblem/url';
import { downloadEmblemBinary } from '~/lib/web';
import { IGuildEmblem } from '~/types/Guild';

interface ISaveButtonsProps {
  emblem: IGuildEmblem;
  name?: string;
}
export const SaveButtons: React.FC<ISaveButtonsProps> = ({ emblem, name }) => {
  const src = getEmblemUrl(emblem, emblem.size?.toString() ?? '256');

  return (
    <>
      <a
        className="inline-flex w-fit items-center justify-center gap-2 rounded border bg-blue-500 py-2 px-3 text-sm text-white"
        href={src}
        download={`${name ?? 'emblem'}.svg`}
      >
        <MdDownload />
        <span>SVG</span>
      </a>
      <button
        className="inline-flex w-fit items-center justify-center gap-2 rounded border bg-blue-500 py-2 px-3 text-sm text-white"
        onClick={(e) => downloadEmblemBinary(emblem, 'png', name)}
      >
        <MdDownload />
        <span>PNG</span>
      </button>
      <button
        className="inline-flex w-fit items-center justify-center gap-2 rounded border bg-blue-500 py-2 px-3 text-sm text-white"
        onClick={(e) => downloadEmblemBinary(emblem, 'webp', name)}
      >
        <MdDownload />
        <span>WebP</span>
      </button>
    </>
  );
};

import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import { MdClear, MdContentCopy, MdDownload, MdSave } from 'react-icons/md';
import { getEmblemParams, getEmblemUrl } from '~/lib/emblem/url';
import { IGuildEmblem } from '~/types/Guild';
import { EmblemSVG } from '../EmblemSVG';
import { Section, SectionTitle } from '../layout/Section';
import { BackgroundOptions } from './Background';
import { ForegroundOptions } from './Foreground';

interface IEmblemBuilderProps {
  baseEmblem?: IGuildEmblem;
}
export const EmblemBuilder: React.FC<IEmblemBuilderProps> = ({ baseEmblem }) => {
  const router = useRouter();
  const [emblem, setEmblem] = React.useState<IGuildEmblem>(baseEmblem ?? { background_id: 1 });
  const imgRef = React.useRef<HTMLImageElement>(null);

  const handleChange = (changedState: Partial<IGuildEmblem>) => {
    const newState: IGuildEmblem = {
      ...emblem,
      ...changedState,
    };

    setEmblem(newState);
  };

  useEffect(() => {
    updateUrl(emblem);
  }, [emblem]);

  const updateUrl = (emblem?: IGuildEmblem) => {
    if (emblem === undefined) {
      return window.location.assign('/');
    }

    const queryString = getEmblemParams(emblem, emblemSize).toString();
    const toUrl = `/?${queryString}`;
    return router.push(
      {
        query: queryString,
      },
      undefined,
      { shallow: true }
    );
  };

  const emblemSize = '256';
  const emblemPath = getEmblemUrl(emblem, emblemSize);
  const emblemUrl = `https://guilds.gw2w2w.com${emblemPath}`;

  // copy to clipboard
  const copyToClipboard = (str: string) => {
    navigator.clipboard.writeText(str);
  };

  return (
    <Section>
      <SectionTitle>Emblem Builder</SectionTitle>
      <div className="mb-4 flex grow flex-row items-stretch gap-2 rounded-md border bg-white">
        <input value={emblemUrl} className="grow bg-transparent  px-2 py-1 text-sm" readOnly />
        <div className="flex grow-0 items-center justify-center border-l px-2">
          <MdContentCopy onClick={() => copyToClipboard(emblemUrl)} className="block cursor-pointer" />
        </div>
      </div>
      <div className="flex flex-col rounded-md bg-white p-4 align-top shadow-md lg:flex-row">
        <div className="p-2">
          {emblem && <img ref={imgRef} src={emblemPath} width={512} height={512} alt="emblem builder" />}
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col align-top lg:flex-row">
            <BackgroundOptions emblem={emblem} handleChange={handleChange} />
            <ForegroundOptions emblem={emblem} handleChange={handleChange} />
          </div>
          <ButtonBar emblem={emblem} setEmblem={setEmblem} img={imgRef.current} />
        </div>
      </div>
    </Section>
  );
};

const handleSaveAsPNG = (emblem: IGuildEmblem, imageType: 'png' | 'webp') => {
  const size = emblem.size ?? 512;
  const svg = ReactDOMServer.renderToStaticMarkup(EmblemSVG({ emblem })!);
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const blobURL = URL.createObjectURL(blob);

  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext('2d')!;

    context.drawImage(image, 0, 0, size, size);

    const rendered = canvas.toDataURL(`image/${imageType}`, 1);
    const imageName = `image-${Date.now()}.${imageType}`;
    download(rendered, imageName);
  };
  image.src = blobURL;
};

const download = (href: string, name: string) => {
  const link = document.createElement('a');
  link.download = name;
  link.target = '_blank';
  link.style.opacity = '0';
  document.body.append(link);
  link.href = href;
  link.click();
  link.remove();
};

interface IButtonBarProps {
  emblem: IGuildEmblem;
  img: HTMLImageElement | null;
  setEmblem: (emblem: IGuildEmblem) => void;
}
const ButtonBar: React.FC<IButtonBarProps> = ({ setEmblem, img, emblem }) => {
  const handleClear = () => {
    setEmblem({});
  };

  return (
    <div className="flex flex-row justify-end gap-2 pt-4">
      {img ? (
        <>
          <a
            className="inline-flex w-fit items-center justify-center gap-2 rounded border bg-blue-500 py-2 px-3 text-sm text-white"
            href={img.src}
            download="emblem.svg"
          >
            <MdDownload />
            <span>SVG</span>
          </a>
          <button
            className="inline-flex w-fit items-center justify-center gap-2 rounded border bg-blue-500 py-2 px-3 text-sm text-white"
            onClick={(e) => handleSaveAsPNG(emblem, 'png')}
          >
            <MdDownload />
            <span>PNG</span>
          </button>
          <button
            className="inline-flex w-fit items-center justify-center gap-2 rounded border bg-blue-500 py-2 px-3 text-sm text-white"
            onClick={(e) => handleSaveAsPNG(emblem, 'webp')}
          >
            <MdDownload />
            <span>WebP</span>
          </button>
        </>
      ) : null}
      <button
        onClick={handleClear}
        className="inline-flex w-fit items-center justify-center gap-2 rounded border py-2 px-3 text-sm text-red-700 hover:border-red-900"
      >
        <MdClear />
        <span>Clear</span>
      </button>
    </div>
  );
};

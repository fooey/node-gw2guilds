import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { MdClear, MdContentCopy } from 'react-icons/md';
import { getEmblemParams, getEmblemUrl } from '~/lib/emblem/url';
import { IGuildEmblem } from '~/types/Guild';
import { Section, SectionTitle } from '../layout/Section';
import { SaveButtons } from '../SaveButtons';
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
    <Section className=" mx-auto">
      <SectionTitle>Emblem Builder</SectionTitle>
      <div className="mb-4 flex grow flex-row items-stretch gap-2 border bg-white md:rounded-md">
        <input value={emblemUrl} className="grow bg-transparent  px-2 py-1 text-sm" readOnly />
        <div className="flex grow-0 items-center justify-center border-l px-2">
          <MdContentCopy onClick={() => copyToClipboard(emblemUrl)} className="block cursor-pointer" />
        </div>
      </div>
      <div className="flex flex-col items-center justify-between gap-12 bg-white p-4 shadow-md md:flex-row md:items-start md:rounded-md">
        <div className="flex-auto p-2 ">
          {emblem && (
            <img ref={imgRef} src={emblemPath} width={512} height={512} alt="emblem builder" className={`mx-auto`} />
          )}
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col align-top lg:flex-row">
            <BackgroundOptions emblem={emblem} handleChange={handleChange} />
            <ForegroundOptions emblem={emblem} handleChange={handleChange} />
          </div>
          <ButtonBar emblem={emblem} setEmblem={setEmblem} src={emblemPath} />
        </div>
      </div>
    </Section>
  );
};

interface IButtonBarProps {
  emblem: IGuildEmblem;
  src: string;
  setEmblem: (emblem: IGuildEmblem) => void;
}
const ButtonBar: React.FC<IButtonBarProps> = ({ setEmblem, src, emblem }) => {
  const handleClear = () => {
    setEmblem({});
  };

  return (
    <div className="flex flex-row justify-end gap-2 pt-4">
      <SaveButtons src={src} emblem={emblem} />
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

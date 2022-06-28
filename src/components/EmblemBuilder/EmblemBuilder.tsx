import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { MdContentCopy, MdSave } from 'react-icons/md';
import { getEmblemParams, getEmblemUrl } from '~/lib/emblem/url';
import { IGuildEmblem } from '~/types/Guild';
import { Section, SectionTitle } from '../layout/Section';
import { BackgroundOptions } from './Background';
import { ForegroundOptions } from './Foreground';

interface IEmblemBuilderProps {
  baseEmblem?: IGuildEmblem;
}
export const EmblemBuilder: React.FC<IEmblemBuilderProps> = ({ baseEmblem }) => {
  const router = useRouter();
  const [emblem, setEmblem] = React.useState<IGuildEmblem>(baseEmblem ?? { background_id: 1 });

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
      <div className="flex flex-col align-top lg:flex-row">
        <div className="p-2">{emblem && <Image unoptimized priority src={emblemPath} width={512} height={512} />}</div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col align-top lg:flex-row">
            <BackgroundOptions emblem={emblem} handleChange={handleChange} />
            <ForegroundOptions emblem={emblem} handleChange={handleChange} />
          </div>
          <div className="flex flex-col gap-2">
            {/* <button
              onClick={() => updateUrl(emblem)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-200 p-4 text-lg shadow-md hover:shadow-lg"
            >
              <MdSave />
              <span>Save State</span>
            </button> */}
            <button
              onClick={() => setEmblem({})}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-100 p-4 text-lg shadow-md hover:shadow-lg"
            >
              <MdSave />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
};

/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { MdContentCopy } from 'react-icons/md';
import { getEmblemParams, getEmblemUrl } from '~/lib/emblem/url';
import { IGuildEmblem } from '~/types/Guild';
import { Section, SectionTitle } from '../layout/Section';
import { BackgroundOptions } from './Background';
import { ForegroundOptions } from './Foreground';

export const EmblemBuilder = () => {
  const router = useRouter();
  const [emblem, setEmblem] = React.useState<IGuildEmblem>({});
  const urlParams = getEmblemParams(emblem, '256');

  useEffect(() => {
    // router.push(`/?${urlParams.toString()}`);
  }, [router, urlParams]);

  const handleChange = (changedState: Partial<IGuildEmblem>) => {
    setEmblem((currentState) => ({
      ...currentState,
      ...changedState,
    }));
  };

  const emblemSize = '256';
  const emblemPath = getEmblemUrl(emblem, emblemSize);
  const emblemUrl = `https://guilds.gw2w2w.com${emblemPath}`;

  // copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(emblemUrl);
  };

  return (
    <Section>
      <SectionTitle>Emblem Builder</SectionTitle>
      <div className="relative pb-4">
        <input value={emblemUrl} className="h-8 w-full rounded-sm p-1 text-sm" readOnly />
        <div className="absolute right-2 top-0 flex h-8 cursor-pointer items-center justify-center">
          <MdContentCopy onClick={copyToClipboard} />
        </div>
      </div>
      <div className="flex flex-col align-top lg:flex-row">
        <div>
          <div className="p-2">
            <img src={emblemPath} width={512} height={512} />
          </div>
        </div>
        <div className="flex flex-col align-top lg:flex-row">
          <BackgroundOptions emblem={emblem} handleChange={handleChange} />
          <ForegroundOptions emblem={emblem} handleChange={handleChange} />
        </div>
      </div>
    </Section>
  );
};

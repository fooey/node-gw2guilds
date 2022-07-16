/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import axios from 'axios';
import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { MdEdit, MdRefresh } from 'react-icons/md';
import { EmblemBuilder } from '~/components/EmblemBuilder/EmblemBuilder';
import { EmblemSVG } from '~/components/EmblemSVG';
import { LayoutMain } from '~/components/layout/Main';
import { Section, SectionTitle } from '~/components/layout/Section';
import { lookupRandomGuilds } from '~/lib/db/guilds/random';
import { getValidatedEmblemParams } from '~/lib/emblem/api';
import { IGuild, IGuildEmblem } from '~/types/Guild';
import { defaultParams, IQueryParams } from './api/emblem';

const NUM_RANDOM_GUILDS = 20;

type IHomeProps = {
  guilds: IGuild[];
  emblemState: IGuildEmblem | null;
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const guilds = lookupRandomGuilds(NUM_RANDOM_GUILDS);

  const { errors, emblem } = getValidatedEmblemParams({ ...defaultParams, ...(query as IQueryParams) });

  return {
    props: {
      guilds,
      emblemState: errors.length === 0 ? emblem : null,
    },
  };
};

const Home: NextPage<IHomeProps> = ({ guilds, emblemState }) => {
  const [emblem, setEmblem] = React.useState<IGuildEmblem | undefined>(emblemState ?? undefined);

  return (
    <>
      <Head>
        <title>g2w2w2 guild emblems</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LayoutMain>
        <div className="mx-auto flex max-w-4xl flex-col gap-12">
          <EmblemBuilder baseEmblem={emblem} key={JSON.stringify(emblem)} />
          <ExampleGuilds guilds={guilds} onEdit={setEmblem} />
        </div>
      </LayoutMain>
    </>
  );
};

interface IExampleGuildsProps {
  guilds: IGuild[];
  onEdit: (emblem: IGuildEmblem) => void;
}
const ExampleGuilds: React.FC<IExampleGuildsProps> = ({ guilds, onEdit }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [examples, setExamples] = React.useState<IGuild[]>(guilds);
  const sampleSize = 128;

  const handleGetRandomGuilds = async () => {
    setIsLoading(true);
    axios
      .get<IGuild[]>(`/api/guilds/random`)
      .then((response) => response.data)
      .then((guilds) => {
        setExamples(guilds);
      })
      .finally(() => setIsLoading(false));
  };

  const handleEdit = (emblem: IGuildEmblem) => {
    window.scrollTo(0, 0);
    return onEdit(emblem);
  };

  return (
    <Section className="">
      <SectionTitle className="flex flex-row items-center justify-between">
        <div>Random Guild Examples</div>
        <MdRefresh
          onClick={() => handleGetRandomGuilds()}
          className={`cursor-pointer text-base ${isLoading ? 'animate-spin' : ''}`}
        />
      </SectionTitle>
      <ul className="flex flex-wrap justify-center gap-2 text-xs">
        {examples.map((guild) => {
          const guildUrl = `/guilds/${guild.slug}`;
          const emblemParams = { ...guild, size: sampleSize };
          const fullName = `[${guild.tag}] ${guild.guild_name}`;

          return (
            <li key={guild.guild_id} className="w-40 rounded-sm hover:bg-slate-100 hover:shadow-md">
              <div className="flex flex-col items-center justify-center">
                <Link href={guildUrl}>
                  <a>
                    <EmblemSVG emblem={emblemParams} title={fullName} />
                  </a>
                </Link>
                <div className="leading-0 flex flex-col items-center gap-1 p-2 text-center">
                  <Link href={guildUrl}>
                    <a className="flex flex-col items-center justify-center">
                      <div className="text-sm font-semibold">[{guild.tag}]</div>
                      <div className="w-32 truncate">{guild.guild_name}</div>
                    </a>
                  </Link>
                  <a
                    className="flex cursor-pointer flex-row items-center justify-center gap-2"
                    onClick={() => handleEdit(guild)}
                  >
                    <MdEdit /> <div>Edit</div>
                  </a>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
};

export default Home;

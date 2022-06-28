/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { MdEdit } from 'react-icons/md';
import { EmblemBuilder } from '~/components/EmblemBuilder/EmblemBuilder';
import { LayoutMain } from '~/components/layout/Main';
import { Section, SectionTitle } from '~/components/layout/Section';
import { getValidatedEmblemParams } from '~/lib/emblem/api';
import { getEmblemParams, getEmblemUrl } from '~/lib/emblem/url';
import { db } from '~/lib/sql';
import { IGuild, IGuildEmblem } from '~/types/Guild';
import { defaultParams, IQueryParams } from './api/svg/emblem';

type IHomeProps = {
  guilds: IGuild[];
  emblemState: IGuildEmblem | null;
};

const sqlString = `
  SELECT *
  FROM guilds
  WHERE guild_id IN (
    SELECT guild_id
    FROM guilds
    WHERE background_id IS NOT NULL
      AND foreground_id IS NOT NULL
      AND modified_date > date('2022-01-01')
    ORDER BY RANDOM()
     LIMIT 12
  );
`;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const sqlStatement = db.prepare(sqlString);
  const guilds: IGuild[] = sqlStatement.all();
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
        <div className="flex flex-col gap-12">
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
  const sampleSize = '128';

  const handleEdit = (emblem: IGuildEmblem) => {
    window.scrollTo(0, 0);
    return onEdit(emblem);
  };

  return (
    <Section>
      <SectionTitle>Emblem Examples</SectionTitle>
      <ul className="flex max-w-3xl flex-wrap justify-center gap-2 text-xs">
        {guilds.map((guild) => {
          const guildUrl = `/guilds/${guild.slug}`;
          const emblemParams = getEmblemParams(guild, sampleSize);
          const emblemUrl = getEmblemUrl(guild, sampleSize);

          return (
            <li key={guild.guild_id} className="w-40 rounded-sm hover:bg-slate-100   hover:shadow-md">
              <div className="flex flex-col">
                <Link href={guildUrl}>
                  <a>
                    <Image
                      unoptimized
                      src={emblemUrl}
                      alt={`fullName`}
                      width={sampleSize}
                      height={sampleSize}
                      layout="responsive"
                    />
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

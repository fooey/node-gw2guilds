/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { EmblemBuilder } from '~/components/EmblemBuilder/EmblemBuilder';
import { LayoutMain } from '~/components/layout/Main';
import { Section, SectionTitle } from '~/components/layout/Section';
import { db } from '~/lib/sql';
import { IGuild } from '~/types/Guild';

type IHomeProps = {
  guilds: IGuild[];
};

const sqlString = `
  SELECT guild_id, guild_name, slug, tag
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const sqlStatement = db.prepare(sqlString);
  const guilds: IGuild[] = sqlStatement.all();

  return {
    props: {
      guilds,
    },
  };
};

const Home: NextPage<IHomeProps> = ({ guilds }) => {
  return (
    <>
      <Head>
        <title>g2w2w2 guild emblems</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LayoutMain>
        <div className="flex flex-col gap-12">
          <EmblemBuilder />
          {/* <ExampleGuilds guilds={guilds} /> */}
        </div>
      </LayoutMain>
    </>
  );
};

const ExampleGuilds: React.FC<{ guilds: IGuild[] }> = ({ guilds }) => {
  return (
    <Section>
      <SectionTitle>Emblem Examples</SectionTitle>
      <ul className="flex flex-wrap">
        {guilds.map((guild) => {
          const guildUrl = `/guilds/${guild.slug}`;
          const emblemUrl = `https://guilds.gw2w2w.com${guildUrl}/256.svg`;

          return (
            <li key={guild.guild_id}>
              <Link href={guildUrl}>
                <a className="cursor-pointer">
                  <img src={emblemUrl} alt={`${guild.tag} ${guild.guild_name}`} width={128} height={128} />
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
    </Section>
  );
};

export default Home;

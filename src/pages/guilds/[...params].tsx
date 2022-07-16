import { castArray } from 'lodash';
import { GetServerSidePropsContext, NextPage } from 'next';
import { EmblemSVG } from '~/components/EmblemSVG';
import { LayoutMain } from '~/components/layout/Main';
import { Section, SectionTitle } from '~/components/layout/Section';
import { getEmblemUrl } from '~/lib/emblem/url';
import { db } from '~/lib/sql';
import { IGuild } from '~/types/Guild';

export interface IGuildParams {
  guild: string;
}
export interface IGuildProps {
  guild: IGuild;
}

const guildSql = `
  SELECT *
  from guilds
  WHERE slug = @slug
`;

const guildStatement = db.prepare(guildSql);

const svgRegex = /\bsvg$/;

export const getServerSideProps = async ({ query, resolvedUrl }: GetServerSidePropsContext) => {
  const { params } = query;
  let [guildSlug, optionsSlug] = castArray(params);

  if (guildSlug === undefined || Array.isArray(guildSlug)) {
    return {
      notFound: true,
    };
  }

  const isSvg = svgRegex.test(resolvedUrl);

  if (isSvg) {
    guildSlug = guildSlug.split('.')[0];
  }

  const guild: IGuild = guildStatement.get({ slug: guildSlug });

  if (guild === undefined) {
    return {
      notFound: true,
    };
  } else if (isSvg) {
    const config = (optionsSlug ?? '').split('.');

    let size = '256';
    if (config.length > 1) {
      size = config[0];
    }

    if (config.length > 2) {
      guild.bg_color = config[1];
    }

    return {
      redirect: {
        destination: getEmblemUrl(guild, size),
        permanent: true,
      },
    };
  } else {
    return {
      props: { guild }, // will be passed to the page component as props
    };
  }
};

const Guild: NextPage<IGuildProps> = ({ guild }) => {
  return (
    <LayoutMain>
      <div className="mx-auto flex max-w-4xl flex-col">
        <Section className="w-full">
          <SectionTitle className="w-full">
            [{guild.tag}] {guild.guild_name}
          </SectionTitle>
        </Section>

        <div className="flex flex-row rounded bg-white align-top shadow-lg">
          <div>
            <EmblemSVG emblem={{ ...guild, size: 512 }} />
          </div>
          <div>
            <pre className="text-xs leading-tight">{JSON.stringify(guild, null, 2)}</pre>
          </div>
        </div>
      </div>
    </LayoutMain>
  );
};

export default Guild;

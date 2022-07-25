import { castArray } from 'lodash';
import { GetServerSidePropsContext, NextPage } from 'next';
import Link from 'next/link';
import { db } from '~/lib/db/db';
import { IGuild } from '~/types/Guild';

export interface IGuildParams {
  guild: string;
}
export interface IGuildProps {
  guild: IGuild;
}

const guildSql = `
  SELECT *
  FROM guilds
  WHERE guild_id = @id
`;

const guildStatement = db.prepare(guildSql);

const svgRegex = /\bsvg$/;
const uuidRegex = /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;

export const getServerSideProps = async ({ query, resolvedUrl }: GetServerSidePropsContext) => {
  const { params } = query;
  let [uuid] = castArray(params);

  const isSvg = svgRegex.test(resolvedUrl);

  if (isSvg) {
    uuid = uuid.split('.')[0];
  }

  if (uuid === undefined || Array.isArray(uuid) || !uuidRegex.test(uuid)) {
    return {
      notFound: true,
    };
  }

  const guild: IGuild = guildStatement.get({ id: uuid.toLowerCase() });

  if (guild === undefined) {
    return {
      notFound: true,
    };
  } else if (isSvg) {
    return {
      redirect: {
        destination: `/guilds/${guild.slug}.svg`,
        permanent: true,
      },
    };
  } else {
    return {
      redirect: {
        destination: `/guilds/${guild.slug}`,
        permanent: true,
      },
    };
  }
};

const Guild: NextPage<IGuildProps> = ({ guild }) => {
  return (
    <h1>
      redirecting to <Link href={`/guilds/${guild.slug}`}>/guilds/${guild.slug}</Link>
    </h1>
  );
};

export default Guild;

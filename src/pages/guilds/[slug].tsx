import { ServerResponse } from 'http';
import { GetServerSidePropsContext, NextPage } from 'next';
import Image from 'next/image';
import { LayoutMain } from '~/components/layout/Main';
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

const Guild: NextPage<IGuildProps> = ({ guild }) => {
  const { slug } = guild;
  console.log(`🚀 ~ file: [guild].tsx ~ line 11 ~ guild`, guild);
  return (
    <LayoutMain>
      <h1>{slug}</h1>
      <ul>
        <li>
          <Image src={`/guilds/${slug}.svg`} alt={slug} width="256" height="256" />
        </li>
        <li>
          {/* eslint-disable-next-line @next/next/no-img-element*/}
          <img src={`https://guilds.gw2w2w.com/guilds/${slug}.svg`} alt={slug} width="256" height="256" />
        </li>
      </ul>

      <pre>{JSON.stringify(guild, null, 2)}</pre>
    </LayoutMain>
  );
};

const svgRegex = /.*\.svg$/;

type IGetServerSideProps = (context: GetServerSidePropsContext) => Promise<ServerResponse | { props: IGuildProps }>;

export const getServerSideProps: IGetServerSideProps = async (context: GetServerSidePropsContext) => {
  const { res, query } = context;
  const { slug } = query;

  if (slug === undefined || Array.isArray(slug)) {
    throw new Error('slug must be a string');
  }

  const guild: IGuild = guildStatement.get({ slug });
  console.log(`🚀 ~ file: [slug].tsx ~ line 61 ~ constgetServerSideProps:IGetServerSideProps= ~ guild`, guild);

  if (svgRegex.test(slug)) {
    res.setHeader('Content-Type', 'image/svg+xml');
    res.write(svg);
    res.end();
  }

  return {
    props: { guild }, // will be passed to the page component as props
  };
};

const svg = `<svg width="128pt" height="128pt" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
    <path fill="#290f0f" opacity=".68" d="M61.98 34.77c4.75-.05 9.53-3.1 14.21-.84-3.35.06-6.71.23-10 .89-.08 5.92-.32 11.86.23 17.78l4.18-.4c-.63-1.77-1.25-3.53-1.87-5.3.85-1.64 1.71-3.27 2.57-4.9 1.48.74 2.95 1.49 4.43 2.23l-.18.69c-1.56-.55-3.12-1.11-4.67-1.65-1.66 3.2-.13 6.32 1.96 8.83-.62.09-1.85.26-2.46.34-1.2.16-2.41.31-3.61.46.1 2.35.23 4.7.37 7.05 1.85.11 3.7.24 5.55.37l-.86 1.03c-3.03-.05-6.11.3-8.26 2.7-.06-.39-.17-1.16-.23-1.54 2.69-2.21 2.08-5.49 1.42-8.47.01-3.36.19-6.72.39-10.07.46-3.03-.38-5.99-1.36-8.82-2.21.49-4.44.88-6.67 1.28 1.27-1.29 3.13-1.57 4.86-1.66z"/>
    <path fill="#943836" d="M66.19 34.82c3.29-.66 6.65-.83 10-.89.93 3.41.72 6.97-.46 10.3-1.48-.74-2.95-1.49-4.43-2.23-.86 1.63-1.72 3.26-2.57 4.9.62 1.77 1.24 3.53 1.87 5.3l-4.18.4c-.55-5.92-.31-11.86-.23-17.78z"/>
    <path fill="#1e0b0b" opacity=".52" d="M76.19 33.93c2.08 3.63 7 .61 10.18 2.52.17 2.4.31 4.8.44 7.21 6.03-.76 12.06-1.59 18.12-2.04-.23-.6-.68-1.79-.91-2.38.49.29 1.46.88 1.94 1.18-.12.54-.35 1.62-.47 2.16-6.24.46-12.49 1.03-18.66 2.18.73 1.29 1.77 2.32 3.07 3.04l1.12 2.6c5.23.27 10.35-1.64 15.57-.93-.91 1.35-1.8 2.7-2.7 4.06l-.39.58c.09-.98.26-2.93.34-3.91-4.4.09-8.81.49-13.12 1.41-.19 3-.01 6 .4 8.97.61 4.68-.04 9.4.29 14.1l-.81.05c-.13-2.99-.14-5.99-.05-8.98-.13-4.28-.67-8.54-.68-12.83-.24-1.71.07-4.16-1.96-4.89-3.97-1.58-8.4-1.45-12.36-3.11l.18-.69c1.18-3.33 1.39-6.89.46-10.3m1.32 2.69c-.22 2.71-.37 5.43-.42 8.16 3.04.65 6.1 1.2 9.2 1.48-.43-3.19.13-6.57-1.11-9.61-2.56-.09-5.11-.14-7.67-.03z"/>
    <path fill="#7b2d2c" d="M57.12 36.43c2.23-.4 4.46-.79 6.67-1.28.98 2.83 1.82 5.79 1.36 8.82-3.25-1.12-6.58-.71-8.97 1.93.1-3.07-2.19-7.47.94-9.47z"/>
    <path fill="#732c29" d="M104.19 34.54c4.94 3.08 9.84 6.23 14.69 9.46-3.64 3.64-7.01 7.54-10.02 11.72l-2.72.16c-.75-.78-1.5-1.57-2.25-2.35.9-1.36 1.79-2.71 2.7-4.06 2.66.3 5.01-1.5 6.56-3.5-.24-.2-.7-.6-.93-.8-2.07-1.61-4.13-3.23-6.26-4.75-.48-.3-1.45-.89-1.94-1.18-.57-.33-1.7-.98-2.27-1.3.81-1.14 1.62-2.27 2.44-3.4z"/>
    <path fill="#943736" d="M77.51 36.62c2.56-.11 5.11-.06 7.67.03 1.24 3.04.68 6.42 1.11 9.61-3.1-.28-6.16-.83-9.2-1.48.05-2.73.2-5.45.42-8.16z"/>
    <path fill="#863234" d="M47.58 42.71c2.17-1.31 4.56-2.21 6.67-3.63 1.63 3.65 1.25 7.74 1.48 11.63-3.03 1.53-6.65 2.96-7.49 6.69.02 1.1.05 2.2.11 3.3-.61-1.44-.69-3-.49-4.54.05-1.01.16-3.02.21-4.03-1.21-.93-2.45-1.8-3.74-2.6.17-.92.33-1.83.5-2.74.51.26 1.51.79 2.02 1.05.02-1.72-1.2-4.03.73-5.13z"/>
    <path d="M105.96 40.42c2.13 1.52 4.19 3.14 6.26 4.75-7.44.86-14.93 1.41-22.32 2.63-1.3-.72-2.34-1.75-3.07-3.04 6.17-1.15 12.42-1.72 18.66-2.18.12-.54.35-1.62.47-2.16zM56.18 45.9c2.39-2.64 5.72-3.05 8.97-1.93-.2 3.35-.38 6.71-.39 10.07-.63.07-1.88.19-2.51.26-2.07.04-4.41.2-6.09-1.24.1-2.39.09-4.78.02-7.16z" fill="#9c3839"/>
    <path fill="#863131" d="M70.88 43.27c1.55.54 3.11 1.1 4.67 1.65 3.96 1.66 8.39 1.53 12.36 3.11 2.03.73 1.72 3.18 1.96 4.89-1.15-.68-2.3-1.36-3.44-2.06 1.06 2.31 1.54 4.8 1.58 7.33-2-.49-3.95-1.14-5.83-1.96.52 2.32 2.61 5.31.41 7.34-3.46 2.91-7.8 4.43-11.95 6.07-3.78 1.41-6.62 4.41-10.09 6.37-.22-.76-.65-2.27-.87-3.03 2.77-1.58 4.37-4.45 6.74-6.48 3.87-1.99 8.39-2.64 11.87-5.41 1.88-1.4 1.36-4.12.75-6.05-2.03-1.07-4.19-1.85-6.2-2.94-2.09-2.51-3.62-5.63-1.96-8.83z"/>
    <path fill="#732b2b" d="M26.79 45.03c2.01-.22 4.07-.81 6.09-.41 2.09 1.39 3.86 3.19 5.68 4.9.71.12 2.14.34 2.85.45-8.34 2.44-17.29 1.86-25.56 4.57 2.79.29 5.59.53 8.39.63-3.63.55-7.29.89-10.97 1.01l-.32-2.2c1.29-.42 2.57-.83 3.87-1.22-1.51-1.36-3.07-2.66-4.61-4l-1.43-1.83c2.12-.24 4.23-.42 6.35-.55 1.87 1.64 3.61 3.48 5.87 4.6C21.5 49.4 19.74 48 18.78 46c1.79-.23 3.57-.44 5.36-.66 3.21 1.52 5.18 5.24 8.92 5.53-2.2-1.81-5.11-3.05-6.27-5.84z"/>
    <path fill="#421818" d="M89.9 47.8c7.39-1.22 14.88-1.77 22.32-2.63.23.2.69.6.93.8-1.55 2-3.9 3.8-6.56 3.5-5.22-.71-10.34 1.2-15.57.93l-1.12-2.6z"/>
    <path fill="#120706" opacity=".46" d="M12.21 48.76c1.54 1.34 3.1 2.64 4.61 4-1.3.39-2.58.8-3.87 1.22l.32 2.2c.18.97.36 1.94.55 2.92 4.9.04 9.74-1.45 14.6-1.08.1.1.28.31.37.41-1.39.37-2.79.64-4.18.99-.27.34-.82 1.01-1.1 1.35-.92 1.29-1.77 2.62-2.63 3.94 1.94-.25 3.89-.5 5.84-.74.94-1.23 1.89-2.47 2.72-3.78.13-.54.4-1.6.54-2.14l.4-.47c4.9-.87 9.91-1.13 14.84-1.87l-.14.95c-.92 5.23-1.1 10.54-1.44 15.83-.02 3.45-1.46 7.46.94 10.42l.46.74c-.56-.13-1.68-.38-2.24-.51-1-8.68.82-17.34 1.13-26.01l-4.15.04c-.29.28-.85.83-1.13 1.1-1.8-.4-3.64-.47-5.47-.37l-1.28 1.8c-.98 1.37-1.96 2.74-2.94 4.12 2.05-.2 4.11-.39 6.15-.63-1.85 1.26-4.1 1.07-6.23 1.14-5.28.81-10.64 1.53-15.96 1.91l-.25-1.08c.19-.22.56-.67.75-.89l.47 1.11c1.64-.08 3.29-.21 4.93-.33.97-1.24 1.94-2.47 2.82-3.78l1.15-1.83c-2.26.11-4.5.45-6.69.99-3.74.35-3.67-4.27-3.57-6.86.61-.34 1.84-1.04 2.45-1.38-1.14-.95-2.34-1.95-2.77-3.43z"/>
    <path fill="#9c3c39" d="M41.41 49.97l2.92-.44c1.29.8 2.53 1.67 3.74 2.6-7.88 1.48-15.9 1.92-23.83 3.04-2.8-.1-5.6-.34-8.39-.63 8.27-2.71 17.22-2.13 25.56-4.57z"/>
    <path fill="#a53e3c" d="M48.24 57.4c.84-3.73 4.46-5.16 7.49-6.69.06 1.9.1 3.8.13 5.71-2.45.86-5.02 1.26-7.62.98z"/>
    <path fill="#732b29" d="M86.43 50.86c1.14.7 2.29 1.38 3.44 2.06.01 4.29.55 8.55.68 12.83-.65 6.02-6.76 7.91-11.08 10.79-6.76 4.73-15.54 7.16-19.95 14.68 1.52-.09 3.04-.21 4.55-.36-1.41 2.34-2.78 5.13-5.71 5.73-2.08.28-2.04 2.69-2.34 4.28-.84-.04-2.51-.13-3.34-.18-1.82-.31-3.48-1.1-5.12-1.9l-.27-.13c-.79-3.73-.48-7.54-.49-11.31 1.75-.01 3.51.01 5.26.03-1.09-.36-2.18-.71-3.27-1.08-1.33-1.22-2.77-2.31-4.21-3.39-2.4-2.96-.96-6.97-.94-10.42 1.26.95 2.52 1.9 3.77 2.85 1.08-3.3 4.37-1.73 6.5-.58.98-.43 1.96-.88 2.96-1.27.7-.1 1.4-.22 2.1-.35l.71-.16c.22.76.65 2.27.87 3.03 3.47-1.96 6.31-4.96 10.09-6.37 4.15-1.64 8.49-3.16 11.95-6.07 2.2-2.03.11-5.02-.41-7.34 1.88.82 3.83 1.47 5.83 1.96-.04-2.53-.52-5.02-1.58-7.33z"/>
    <path fill="#170909" opacity=".6" d="M70.38 52.44c.61-.08 1.84-.25 2.46-.34 2.01 1.09 4.17 1.87 6.2 2.94.61 1.93 1.13 4.65-.75 6.05-2.15.13-4.31.16-6.46.26l.86-1.03c.33-.43.98-1.29 1.31-1.72.62-2.87-1.68-4.56-3.62-6.16m5.99 3.78c-.79.93-.83 3.08.54 3.49 2.14-.22 1.69-4.7-.54-3.49z"/>
    <path d="M24.24 55.17c7.93-1.12 15.95-1.56 23.83-3.04-.05 1.01-.16 3.02-.21 4.03-.69.13-2.08.38-2.78.5l.14-.95c-4.93.74-9.94 1-14.84 1.87l-.4.47c-.14.54-.41 1.6-.54 2.14-1.98.2-3.95.39-5.93.58.28-.34.83-1.01 1.1-1.35 1.39-.35 2.79-.62 4.18-.99-.09-.1-.27-.31-.37-.41-4.86-.37-9.7 1.12-14.6 1.08-.19-.98-.37-1.95-.55-2.92 3.68-.12 7.34-.46 10.97-1.01zm24 2.23c2.6.28 5.17-.12 7.62-.98.25 1.81.46 3.63.62 5.45-2.19-.45-4.42-.4-6.63-.23-.51-.29-1.02-.6-1.5-.94-.06-1.1-.09-2.2-.11-3.3z" fill="#391818"/>
    <path d="M66.77 52.9c1.2-.15 2.41-.3 3.61-.46 1.94 1.6 4.24 3.29 3.62 6.16-.33.43-.98 1.29-1.31 1.72-1.85-.13-3.7-.26-5.55-.37-.14-2.35-.27-4.7-.37-7.05zm12.7 23.64c4.32-2.88 10.43-4.77 11.08-10.79-.09 2.99-.08 5.99.05 8.98l.02.39c-6.76 3.91-12.66 9.14-19.25 13.29-2.41.89-4.83 1.76-7.3 2.45-1.51.15-3.03.27-4.55.36 4.41-7.52 13.19-9.95 19.95-14.68z" fill="#3c1717"/>
    <path fill="#3c1718" d="M62.25 54.3c.63-.07 1.88-.19 2.51-.26.66 2.98 1.27 6.26-1.42 8.47l-.9 1.06c-4.89 1.2-7.22-4.61-5.16-8.29 1.52-.76 3.32-.67 4.97-.98z"/>
    <path fill="#893131" d="M45.08 56.66c.7-.12 2.09-.37 2.78-.5-.2 1.54-.12 3.1.49 4.54.48.34.99.65 1.5.94.4.24 1.21.71 1.61.95 2.47 2.37 6.54 2.92 8.02 6.23-1.19 1.35-2.08 2.94-2.61 4.67-1 .39-1.98.84-2.96 1.27-2.13-1.15-5.42-2.72-6.5.58-1.25-.95-2.51-1.9-3.77-2.85.34-5.29.52-10.6 1.44-15.83z"/>
    <path fill="#391616" opacity=".98" d="M76.37 56.22c2.23-1.21 2.68 3.27.54 3.49-1.37-.41-1.33-2.56-.54-3.49z"/>
    <path fill="#3e1718" opacity=".9" d="M33.18 57.9c1.83-.1 3.67-.03 5.47.37-.77 1.18-1.54 2.35-2.32 3.51l-.11-.54c-.07-.4-.21-1.18-.28-1.57l-4.04.03 1.28-1.8z"/>
    <path fill="#421917" d="M16.1 60.43c2.19-.54 4.43-.88 6.69-.99l-1.15 1.83c-2.1.22-4.21.29-6.32.34l.78-1.18z"/>
    <path fill="#722927" opacity=".98" d="M23.51 60.77c1.98-.19 3.95-.38 5.93-.58-.83 1.31-1.78 2.55-2.72 3.78-1.95.24-3.9.49-5.84.74.86-1.32 1.71-2.65 2.63-3.94z"/>
    <path fill="#722b28" d="M28.96 63.82c.98-1.38 1.96-2.75 2.94-4.12l4.04-.03c.07.39.21 1.17.28 1.57-.27.48-.83 1.46-1.11 1.95-2.04.24-4.1.43-6.15.63z"/>
    <path fill="#722a29" d="M15.32 61.61c2.11-.05 4.22-.12 6.32-.34-.88 1.31-1.85 2.54-2.82 3.78-1.64.12-3.29.25-4.93.33l-.47-1.11c.63-.89 1.27-1.77 1.9-2.66z"/>
    <path fill="#602426" d="M63.57 64.05c2.15-2.4 5.23-2.75 8.26-2.7 2.15-.1 4.31-.13 6.46-.26-3.48 2.77-8 3.42-11.87 5.41-2.37 2.03-3.97 4.9-6.74 6.48l-.71.16c.65-1.29 1.28-2.95.51-4.32-1.48-3.31-5.55-3.86-8.02-6.23 2.3-.19 4.35 1.24 6.67 1.14.55.28 1.66.84 2.21 1.11.27.66.54 1.32.8 1.97.52-1.15 1.48-1.98 2.43-2.76z"/>
    <path fill="#3f1618" opacity=".83" d="M59.48 68.82c.77 1.37.14 3.03-.51 4.32-.7.13-1.4.25-2.1.35.53-1.73 1.42-3.32 2.61-4.67z"/>
    <path fill="#4d1d1e" d="M74.25 88.7c.6-.98 1.57-1.34 2.9-1.08.2 5.85-.74 11.68-.26 17.55-6.87.5-14.01.79-20.7-1.05l-.08-.95c1.16.07 2.33.14 3.5.2 1.35-1.27 2.43-3.18 4.41-3.48 3.22-.47 6.48-.11 9.72-.07 1.23-3.58 2.92-7.61.51-11.12z"/>
    <path fill="#0b0404" opacity=".38" d="M77.15 87.62c.38 1.11.76 2.22 1.17 3.33-1.16 4.62-.45 9.35-.38 14.04-.18.3-.54.91-.72 1.21-5.37.48-10.79.13-16.17 0-2.83.02-5.52-.95-7.94-2.36-.11-.79-.33-2.36-.43-3.15.83.05 2.5.14 3.34.18.02.58.07 1.73.09 2.3l.08.95c6.69 1.84 13.83 1.55 20.7 1.05-.48-5.87.46-11.7.26-17.55z"/>
    <path fill="#602424" d="M64.07 90.86c2.47-.69 4.89-1.56 7.3-2.45.72.08 2.16.22 2.88.29 2.41 3.51.72 7.54-.51 11.12-3.24-.04-6.5-.4-9.72.07-1.98.3-3.06 2.21-4.41 3.48-1.17-.06-2.34-.13-3.5-.2-.02-.57-.07-1.72-.09-2.3.3-1.59.26-4 2.34-4.28 2.93-.6 4.3-3.39 5.71-5.73z"/>
    <path fill="#321212" opacity=".81" d="M47.56 98.79c1.64.8 3.3 1.59 5.12 1.9.1.79.32 2.36.43 3.15-1.94 1-3.95.44-5.76-.49.03-1.53.1-3.05.21-4.56z"/>
</svg>
`;

export default Guild;

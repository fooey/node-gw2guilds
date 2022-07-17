import { castArray, get } from 'lodash';
import { GetServerSidePropsContext, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { MdContentCopy, MdEdit, MdOpenInNew } from 'react-icons/md';
import { EmblemSVG } from '~/components/EmblemSVG';
import { LayoutMain } from '~/components/layout/Main';
import { Section, SectionTitle } from '~/components/layout/Section';
import { SaveButtons } from '~/components/SaveButtons';
import { getEmblemParams, getEmblemUrl } from '~/lib/emblem/url';
import { db } from '~/lib/sql';
import { slugify } from '~/lib/string';
import { IGuild } from '~/types/Guild';
import { IReactHTMLElement } from '~/types/ReactHTMLElement';

export interface IGuildParams {
  guild: string;
}
export interface IGuildProps {
  guild: IGuild;
}

const guildSql = `
  SELECT *
  FROM guilds
  WHERE slug = @slug
`;

const guildStatement = db.prepare(guildSql);

const svgRegex = /\bsvg$/;

export const getServerSideProps = async ({ query, resolvedUrl }: GetServerSidePropsContext) => {
  const { params } = query;
  let [guildSlug, optionsSlug] = castArray(params);
  console.log(`🚀 ~ file: [...params].tsx ~ line 35 ~ getServerSideProps ~ guildSlug`, guildSlug);

  if (guildSlug === undefined || Array.isArray(guildSlug)) {
    return {
      notFound: true,
    };
  }

  const isSvg = svgRegex.test(resolvedUrl);

  if (isSvg) {
    guildSlug = guildSlug.split('.')[0];
  }

  const guild: IGuild = guildStatement.get({ slug: slugify(guildSlug) });

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
  const router = useRouter();
  const [size, setSize] = useState('512');
  const [bg, _setBg] = useState('');

  const setBg = (bg: string) => {
    console.log(`🚀 ~ file: [...params].tsx ~ line 87 ~ setBg ~ bg`, { bg, first: bg.charAt(0) });
    if (bg.charAt(0) === '#') {
      bg = bg.substring(1);
    }

    _setBg(bg);
  };

  const handleEdit = () => {
    router.push('/?' + getEmblemParams({ ...guild, bg_color: bg }, size));
  };

  return (
    <LayoutMain>
      <div className="mx-auto flex w-fit flex-col gap-8">
        <Section className="w-full">
          <SectionTitle className="w-full">
            [{guild.tag}] {guild.guild_name}
          </SectionTitle>

          <div className="flex flex-col justify-center gap-4 rounded bg-white py-4 shadow-lg ">
            <div className="mx-auto flex flex-col gap-4">
              <EmblemSVG emblem={{ ...guild, bg_color: bg, size: Number(size) }} className="mx-auto" />
              <div className="mx-auto flex flex-row">
                <SaveButtons emblem={guild} name={guild.guild_name} />
                <button
                  className="inline-flex w-fit items-center justify-center gap-2 rounded border bg-blue-500 py-2 px-3 text-sm text-white"
                  onClick={(e) => handleEdit()}
                >
                  <MdEdit />
                  <span>Edit</span>
                </button>
              </div>
            </div>
            <LinkBuilder guild={guild} size={size} setSize={setSize} bg={bg} setBg={setBg} />
          </div>
        </Section>

        <GuildData guild={guild} />
      </div>
    </LayoutMain>
  );
};

interface ILinkBuilderProps {
  guild: IGuild;
  size: string;
  setSize: (size: string) => void;
  bg: string;
  setBg: (bg: string) => void;
}
const LinkBuilder: React.FC<ILinkBuilderProps> = ({ guild, size, bg, setSize, setBg }) => {
  const appUrl = `https://guilds.gw2w2w.com`;
  let emblemUrl = `/guilds/${guild.slug}`;
  let emblemOptions = [];

  if (size !== '256' || bg !== '') {
    if (bg !== '') {
      emblemOptions.push(bg);
    }
    emblemOptions.push(size);
    emblemUrl += `/${emblemOptions.join('.')}`;
  }

  emblemUrl += '.svg';

  return (
    <div className="mx-auto w-full px-4">
      <div>
        <div>
          <label>background color</label>
          <input
            type="color"
            defaultValue={`#${bg !== '' ? bg : 'ffffff'}`}
            onChange={(e) => setBg(e.currentTarget.value)}
          />
        </div>
        <div>
          <label>size</label>
          <input type="number" defaultValue={size} onChange={(e) => setSize(e.currentTarget.value)} min={1} step={1} />
        </div>
      </div>

      <CodeSnippet linkable label="Emblem" value={`${appUrl}${emblemUrl}`} />

      <CodeSnippet
        label="Image"
        rows={4}
        value={`<img
  src="${appUrl}${emblemUrl}"
  width=${size} height=${size}
/>`}
      />

      <CodeSnippet label="BBCODE" value={`[img]${appUrl}${emblemUrl}[/img]`} />

      <CodeSnippet linkable label="Emblem Expanded URL" rows={3} value={`${appUrl}${getEmblemUrl(guild, size)}`} />

      <CodeSnippet linkable label="Emblem Editor URL" rows={3} value={`${appUrl}/?${getEmblemParams(guild, size)}`} />
    </div>
  );
};

interface ICodeSnippetProps extends IReactHTMLElement<HTMLDivElement> {
  label: string;
  value: string;
  rows?: number;
  linkable?: boolean;
}
const CodeSnippet: React.FC<ICodeSnippetProps> = ({ label, value, rows, linkable }) => (
  <div className="flex flex-col  justify-between gap-1 py-2 hover:bg-slate-50">
    <DD>
      {label}{' '}
      {linkable ? (
        <a href={value} target="_blank" rel="noreferrer">
          <MdOpenInNew className="text-sm" />
        </a>
      ) : null}
    </DD>
    <DT value={value} rows={rows} />
  </div>
);
const DD: React.FC<IReactHTMLElement> = ({ children }) => (
  <div className="flex flex-row items-center gap-2">{children}</div>
);
const DT: React.FC<{ value: string; rows?: number }> = ({ value, rows }) => {
  // copy to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
  };

  return (
    <div className="relative w-full flex-auto">
      <textarea
        className="w-full flex-auto overflow-scroll whitespace-pre-wrap break-words rounded border-neutral-400 bg-neutral-50 py-1 px-2 text-xs text-neutral-600 shadow-inner"
        value={value}
        rows={rows ?? 1}
        readOnly
      />
      <MdContentCopy onClick={() => copyToClipboard()} className="absolute right-2 top-1 cursor-pointer" />
    </div>
  );
};

const dataSection = {
  'Guild': ['tag', 'guild_id', 'slug', 'guild_name'],
  'DB': ['modified_date', 'created_date', 'checked_date'],
  'Emblem Background': ['background_id', 'background_color_id', 'flags_flip_bg_horizontal', 'flags_flip_bg_vertical'],
  'Emblem Foreground': [
    'foreground_id',
    'foreground_primary_color_id',
    'foreground_secondary_color_id',
    'flags_flip_fg_horizontal',
    'flags_flip_fg_vertical',
  ],
};

const GuildData: React.FC<{ guild: IGuild }> = ({ guild }) => {
  return (
    <div className="flex flex-col gap-4 rounded bg-white p-4 shadow-lg">
      <div className="grid grid-cols-1 gap-4  text-[10px] leading-tight lg:grid-cols-2">
        {Object.entries(dataSection).map(([section, sectionKeys]) => (
          <div key={section} className="divide-y divide-slate-50 font-mono">
            <h2 className="py-2 font-sans text-lg font-light tracking-wide">{section}</h2>
            <div className="flex flex-col divide-y divide-slate-50">
              {sectionKeys.map((key: string) => (
                <div key={key} className="flex flex-row items-center justify-between gap-4 py-2 hover:bg-slate-50">
                  <div className="uppercase">{key}</div>
                  <code className="w-52 overflow-scroll whitespace-nowrap border-neutral-400 bg-neutral-50 py-1 px-2 text-neutral-600">
                    {get(guild, key) ?? '—'}
                  </code>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div>
        <a
          className="ml-auto flex w-fit cursor-pointer flex-row items-center gap-2 text-sm text-blue-500 hover:text-blue-800"
          href={`https://api.guildwars2.com/v2/guild/${guild.guild_id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>https://api.guildwars2.com/v2/guild/{guild.guild_id}</span>
          <MdOpenInNew />
        </a>
      </div>
    </div>
  );
};

export default Guild;

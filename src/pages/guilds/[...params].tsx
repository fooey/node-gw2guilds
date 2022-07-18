import { castArray, compact, get } from 'lodash';
import { GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { MdCheckBox, MdCheckBoxOutlineBlank, MdContentCopy, MdEdit, MdOpenInNew } from 'react-icons/md';
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
      props: {
        guild,
      },
    };
  }
};

const Guild: NextPage<IGuildProps> = ({ guild }) => {
  const [size, setSize] = useState('512');
  const [bg, _setBg] = useState('ffffff');
  const [isTransparent, setIsTransparent] = useState(true);
  const [fgShadow, setFgShadow] = useState(false);
  const [bgShadow, setBgShadow] = useState(false);

  const setBg = (bg: string) => {
    if (bg.charAt(0) === '#') {
      bg = bg.substring(1);
    }

    _setBg(bg);
  };

  const bg_color = isTransparent ? undefined : bg;
  const flags_fg_shadow = !!fgShadow;
  const flags_bg_shadow = !!bgShadow;

  const emblemUrl = getEmblemUrl({ ...guild, bg_color, flags_fg_shadow, flags_bg_shadow }, size);

  return (
    <LayoutMain>
      <Head>
        <title>
          [{guild.tag}] {guild.guild_name} @ Guild Emblems by g2w2w2.com
        </title>
        <link rel="icon" href={emblemUrl} sizes="any" />
      </Head>
      <div className="mx-auto flex w-fit flex-col gap-8">
        <Section className="w-full">
          <SectionTitle className="flex w-full flex-row items-center gap-4">
            <div>
              [{guild.tag}] {guild.guild_name}
            </div>
          </SectionTitle>

          <div className="flex flex-col justify-center gap-4 rounded bg-white py-4 shadow-lg ">
            <div className="flex flex-col items-center gap-4 px-4 lg:flex-row lg:items-start lg:justify-around">
              <div className="flex flex-col gap-4">
                <h2 className="border-b pb-2 text-xl font-thin">Emblem Options</h2>
                <EmblemOptions
                  guild={guild}
                  size={size}
                  setSize={setSize}
                  bg={bg}
                  setBg={setBg}
                  isTransparent={isTransparent}
                  setIsTransparent={setIsTransparent}
                  fgShadow={fgShadow}
                  setFgShadow={setFgShadow}
                  bgShadow={bgShadow}
                  setBgShadow={setBgShadow}
                />
              </div>
              <div className="max-h-[512px] max-w-[512px] overflow-auto">
                <img src={emblemUrl} alt={guild.guild_name} width={size} height={size} className="max-w-none" />
              </div>
            </div>
            <LinkResources guild={guild} size={size} bg_color={bg_color} />
          </div>
        </Section>

        <GuildData guild={guild} />
      </div>
    </LayoutMain>
  );
};

interface IEmblemOptionsProps {
  guild: IGuild;
  size: string;
  setSize: (size: string) => void;
  bg: string;
  setBg: (bg: string) => void;
  isTransparent: boolean;
  setIsTransparent: (isChecked: boolean) => void;
  fgShadow: boolean;
  setFgShadow: (isChecked: boolean) => void;
  bgShadow: boolean;
  setBgShadow: (isChecked: boolean) => void;
}
const EmblemOptions: React.FC<IEmblemOptionsProps> = ({
  guild,
  size,
  setSize,
  bg,
  setBg,
  isTransparent,
  setIsTransparent,
  fgShadow,
  setFgShadow,
  bgShadow,
  setBgShadow,
}) => {
  const bg_color = isTransparent ? undefined : bg;
  const flags_fg_shadow = !!fgShadow;
  const flags_bg_shadow = !!bgShadow;

  const handleTransprentToggle = () => {
    setIsTransparent(!isTransparent);
  };

  const handleFgShadowToggle = () => {
    setFgShadow(!fgShadow);
  };

  const handleBgShadowToggle = () => {
    setBgShadow(!bgShadow);
  };

  const handleSetBg = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBg(e.currentTarget.value);
  };

  const handleSetSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSize(e.currentTarget.value);
  };

  return (
    <div className="flex select-none flex-col gap-4">
      <div className="flex flex-row items-center gap-4">
        <label className="w-32" htmlFor="transparent">
          Transparent
        </label>
        <CheckboxIcon checked={isTransparent} size="18" className="" onClick={handleTransprentToggle} />
      </div>
      <div className={`flex flex-row items-center gap-4 ${isTransparent ? 'disabled opacity-20' : ''}`}>
        <label className={`w-32 `} htmlFor="bg">
          BG Color
        </label>
        <input
          type="color"
          id="bg"
          value={`#${bg}`}
          disabled={isTransparent}
          onChange={handleSetBg}
          className="w-20 rounded-md"
        />
      </div>
      <div className="flex flex-row items-center gap-4">
        <label className="w-32" htmlFor="size">
          Dimensions
        </label>
        <input
          className="w-20 rounded-md border border-slate-500 py-0 px-2 pr-0 pl-2 text-sm leading-loose shadow-inner"
          id="size"
          type="text"
          value={size}
          onChange={handleSetSize}
          min={1}
          step={1}
        />
      </div>
      <div className="flex flex-row items-center gap-4">
        <span className="w-32" onClick={handleFgShadowToggle}>
          FG Shadow
        </span>
        <CheckboxIcon checked={fgShadow} size="18" className="" onClick={handleFgShadowToggle} />
      </div>
      <div className="flex flex-row items-center gap-4">
        <span className="w-32" onClick={handleBgShadowToggle}>
          BG Shadow
        </span>
        <CheckboxIcon checked={bgShadow} size="18" className="" onClick={handleBgShadowToggle} />
      </div>
      <ButtonBar guild={{ ...guild, bg_color, flags_fg_shadow, flags_bg_shadow }} size={size} />
    </div>
  );
};

interface ICheckboxIconProps extends IReactHTMLElement<HTMLOrSVGElement> {
  checked: boolean;
  size?: string;
}
const CheckboxIcon: React.FC<ICheckboxIconProps> = ({ checked, className, size, ...props }) =>
  checked ? (
    <MdCheckBox className={`${className}`} size={size} {...props} />
  ) : (
    <MdCheckBoxOutlineBlank className={`${className}`} size={size} {...props} />
  );

interface IButtonBarProps {
  guild: IGuild;
  size: string;
}
const ButtonBar: React.FC<IButtonBarProps> = ({ guild, size }) => {
  const router = useRouter();
  const handleEdit = () => {
    router.push('/?' + getEmblemParams({ ...guild, bg_color: undefined }, size));
  };

  const fileName = compact([guild.guild_name, size, guild.bg_color]).join('-');

  return (
    <div className="mx-auto flex flex-row">
      <SaveButtons emblem={guild} name={fileName} />
      <button
        className="inline-flex w-fit items-center justify-center gap-2 rounded border bg-blue-500 py-2 px-3 text-sm text-white"
        onClick={(e) => handleEdit()}
      >
        <MdEdit />
        <span>Edit</span>
      </button>
    </div>
  );
};

interface ILinkBuilderProps {
  guild: IGuild;
  size: string;
  bg_color?: string;
}
const LinkResources: React.FC<ILinkBuilderProps> = ({ guild, size, bg_color }) => {
  const appUrl = `https://guilds.gw2w2w.com`;
  let emblemUrl = `/guilds/${guild.slug}`;
  let emblemOptions = [];

  if (size !== '256' || bg_color) {
    if (bg_color) {
      emblemOptions.push(bg_color);
    }
    emblemOptions.push(size);
    emblemUrl += `/${emblemOptions.join('.')}`;
  }

  emblemUrl += '.svg';

  return (
    <div className="mx-auto w-full px-4">
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
  <div className="flex flex-col  justify-between gap-1 py-2">
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

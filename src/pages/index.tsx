/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { keyBy, max, min, random } from 'lodash';
import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  MdArrowLeft,
  MdArrowRight,
  MdBlock,
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdClear,
  MdMenu,
  MdShuffle,
  MdSwapHoriz,
  MdSwapVert,
} from 'react-icons/md';
import { LayoutMain } from '~/components/layout/Main';
import backgrounds from '~/legacy/lib/gw2emblem/defs.background.json';
import colors from '~/legacy/lib/gw2emblem/defs.color2.json';
import foregrounds from '~/legacy/lib/gw2emblem/defs.foreground.json';
import { DEFAULT_BG_COLORID, DEFAULT_FG_PRIMARY_COLORID, DEFAULT_FG_SECONDARY_COLORID } from '~/lib/emblem/constants';
import { db } from '~/lib/sql';
import { IGuild, IGuildEmblem, IGuildEmblemBackground, IGuildEmblemForeground } from '~/types/Guild';

const backgroundIds = Object.keys(backgrounds).map(Number);
const minBackgroundId = min(backgroundIds) as number;
const maxBackgroundId = max(backgroundIds) as number;

const foregroundIds = Object.keys(foregrounds).map(Number);
const minForegroundId = min(foregroundIds) as number;
const maxForegroundId = max(foregroundIds) as number;

const colorIds = Object.keys(colors).map(Number);
const minColorId = min(colorIds) as number;
const maxColorId = max(colorIds) as number;
const colorsById = keyBy(colors, 'id');

type IBackground = typeof backgrounds[keyof typeof backgrounds];
type IForeground = typeof foregrounds[keyof typeof foregrounds];
type IColor = typeof colors[number];

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

const Section: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <section className="mx-auto mt-4 flex flex-col flex-wrap ">{children}</section>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="mb-4 w-full border-b pb-2 text-2xl">{children}</h2>
);

const EMBLEM_SWATCH_SIZE = '128';

const getBgParams = (emblem: IGuildEmblemBackground, size: string): URLSearchParams =>
  new URLSearchParams({
    size,
    background_id: emblem.background_id?.toString() ?? '1',
    background_color_id: emblem.background_color_id?.toString() ?? '',
    flags_flip_bg_horizontal: emblem.flags_flip_bg_horizontal?.toString() ?? 'false',
    flags_flip_bg_vertical: emblem.flags_flip_bg_vertical?.toString() ?? 'false',
  });

const getFgParams = (emblem: IGuildEmblemForeground, size: string): URLSearchParams =>
  new URLSearchParams({
    size,
    foreground_id: emblem.foreground_id?.toString() ?? '',
    foreground_primary_color_id: emblem.foreground_primary_color_id?.toString() ?? '',
    foreground_secondary_color_id: emblem.foreground_secondary_color_id?.toString() ?? '',
    flags_flip_fg_horizontal: emblem.flags_flip_fg_horizontal?.toString() ?? 'false',
    flags_flip_fg_vertical: emblem.flags_flip_fg_vertical?.toString() ?? 'false',
  });

const getBgUrl = (emblem: IGuildEmblem, size: string): string => {
  return getEmblemUrl(
    {
      ...emblem,
      foreground_id: undefined,
      foreground_primary_color_id: undefined,
      foreground_secondary_color_id: undefined,
      flags_flip_fg_horizontal: undefined,
      flags_flip_fg_vertical: undefined,
    },
    size
  );
};

const getFgUrl = (emblem: IGuildEmblem, size: string): string => {
  return getEmblemUrl(
    {
      ...emblem,
      background_id: undefined,
      background_color_id: undefined,
      flags_flip_bg_horizontal: undefined,
      flags_flip_bg_vertical: undefined,
    },
    size
  );
};

const getEmblemParams = (emblem: IGuildEmblem, size: string): URLSearchParams => {
  const fgParams = getFgParams(emblem, size);
  const bgParams = getBgParams(emblem, size);

  return new URLSearchParams({
    ...Object.fromEntries(fgParams),
    ...Object.fromEntries(bgParams),
  });
};

const getEmblemUrl = (emblem: IGuildEmblem, size: string): string => {
  const emblemParams = getEmblemParams(emblem, size);
  return `/api/svg/emblem?${emblemParams.toString()}`;
};

const EmblemBuilder = () => {
  const router = useRouter();
  const [emblem, setEmblem] = React.useState<IGuildEmblem>({});
  const [showBgPicker, setShowBgPicker] = React.useState(false);
  const [showFgPicker, setShowFgPicker] = React.useState(false);
  const urlParams = getEmblemParams(emblem, '512');

  useEffect(() => {
    // router.push(`/?${urlParams.toString()}`);
  }, [router, urlParams]);

  const handleChange = (changedState: Partial<IGuildEmblem>) => {
    console.log(`🚀 ~ file: index.tsx ~ line 139 ~ handleChange ~ changedState`, changedState);
    setEmblem((currentState) => ({
      ...currentState,
      ...changedState,
    }));
  };

  const handleBgChange = (changedState: Partial<IGuildEmblemBackground>) => {
    setShowBgPicker(!showBgPicker);
    handleChange(changedState);
  };

  const handleFgChange = (changedState: Partial<IGuildEmblemForeground>) => {
    setShowFgPicker(!showFgPicker);
    handleChange(changedState);
  };

  const handlePrevBg = () => {
    let id = emblem.background_id ? emblem.background_id - 1 : maxBackgroundId;
    if (id < minBackgroundId) {
      id = maxBackgroundId;
    }
    return handleChange({ background_id: id });
  };

  const handleNextBg = () => {
    let id = emblem.background_id ? emblem.background_id + 1 : minBackgroundId;
    if (id > maxBackgroundId) {
      id = minBackgroundId;
    }
    return handleChange({ background_id: id });
  };

  const handleRandomBg = () => {
    let id = random(minBackgroundId, maxBackgroundId);
    return handleChange({ background_id: id });
  };

  const handlePrevFg = () => {
    let id = emblem.foreground_id ? emblem.foreground_id - 1 : maxForegroundId;
    if (id < minForegroundId) {
      id = maxForegroundId;
    }
    return handleChange({ foreground_id: id });
  };

  const handleNextFg = () => {
    let id = emblem.foreground_id ? emblem.foreground_id + 1 : minForegroundId;
    if (id > maxForegroundId) {
      id = minForegroundId;
    }
    return handleChange({ foreground_id: id });
  };

  const handleRandomFg = () => {
    let id = random(minForegroundId, maxForegroundId);
    return handleChange({ foreground_id: id });
  };

  const emblemSize = '512';
  const emblemUrl = getEmblemUrl(emblem, emblemSize);

  return (
    <Section>
      <SectionTitle>Emblem Builder</SectionTitle>
      <div className="pb-4">
        <input value={emblemUrl} className="w-full p-1 text-sm" readOnly />
      </div>
      <div className="flex flex-row align-top">
        <div>
          <div className="p-2">
            <img src={emblemUrl} width={emblemSize} height={emblemSize} />
          </div>
        </div>
        <LayerOptions>
          <h3>Background</h3>
          <LayerPreview
            url={emblem.background_id ? getBgUrl(emblem, EMBLEM_SWATCH_SIZE) : null}
            size={EMBLEM_SWATCH_SIZE}
            onClick={() => setShowBgPicker(!showBgPicker)}
            onPrev={handlePrevBg}
            onNext={handleNextBg}
            onClear={() => handleChange({ background_id: undefined })}
            onRandom={handleRandomBg}
          />
          {showBgPicker && <BgPicker emblem={emblem} onChange={handleBgChange} />}
          <FlagToggle
            icon={<MdSwapHoriz />}
            label={`Flip Horizontal`}
            isEnabled={!!emblem.flags_flip_bg_horizontal}
            onClick={() => handleChange({ flags_flip_bg_horizontal: !emblem.flags_flip_bg_horizontal })}
          />
          <FlagToggle
            icon={<MdSwapVert />}
            label={`Flip Vertical`}
            isEnabled={!!emblem.flags_flip_bg_vertical}
            onClick={() => handleChange({ flags_flip_bg_vertical: !emblem.flags_flip_bg_vertical })}
          />
          <ColorPicker
            label="Color"
            currentColor={colorsById[emblem.background_color_id ?? DEFAULT_BG_COLORID]}
            onClick={(id: number) => handleChange({ background_color_id: id })}
          />
        </LayerOptions>
        <LayerOptions>
          <h3>Foreground</h3>
          <LayerPreview
            url={emblem.foreground_id ? getFgUrl(emblem, EMBLEM_SWATCH_SIZE) : null}
            size={EMBLEM_SWATCH_SIZE}
            onClick={() => setShowFgPicker(!showFgPicker)}
            onPrev={handlePrevFg}
            onNext={handleNextFg}
            onClear={() => handleChange({ foreground_id: undefined })}
            onRandom={handleRandomFg}
          />
          {showFgPicker && <FgPicker emblem={emblem} onChange={handleFgChange} />}
          <FlagToggle
            icon={<MdSwapHoriz />}
            label={`Flip Horizontal`}
            isEnabled={!!emblem.flags_flip_fg_horizontal}
            onClick={() => handleChange({ flags_flip_fg_horizontal: !emblem.flags_flip_fg_horizontal })}
          />
          <FlagToggle
            icon={<MdSwapVert />}
            label={`Flip Vertical`}
            isEnabled={!!emblem.flags_flip_fg_vertical}
            onClick={() => handleChange({ flags_flip_fg_vertical: !emblem.flags_flip_fg_vertical })}
          />
          <ColorPicker
            label="Primary"
            currentColor={colorsById[emblem.foreground_primary_color_id ?? DEFAULT_FG_PRIMARY_COLORID]}
            onClick={(id: number) => handleChange({ foreground_primary_color_id: id })}
          />
          <ColorPicker
            label="Secondary"
            currentColor={colorsById[emblem.foreground_secondary_color_id ?? DEFAULT_FG_SECONDARY_COLORID]}
            onClick={(id: number) => handleChange({ foreground_secondary_color_id: id })}
          />
        </LayerOptions>
      </div>
    </Section>
  );
};

interface IColorPickerProps {
  label: string;
  currentColor: IColor;
  onClick: (id: number) => void;
}

const ColorPicker: React.FC<IColorPickerProps> = ({ label, currentColor, onClick }) => {
  console.log(`🚀 ~ file: index.tsx ~ line 312 ~ currentColor`, currentColor);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const handleColorPicker = (colorId: number) => {
    setShowColorPicker(false);
    return onClick(colorId);
  };

  return (
    <div>
      <ColorSwatch color={currentColor} onClick={() => setShowColorPicker(!showColorPicker)} label={label} />
      {showColorPicker && (
        <div className="fixed top-0 left-0 right-0 bottom-0 p-8">
          <ul className="mx-auto flex h-full w-full flex-wrap overflow-auto rounded-md bg-slate-50 p-8 shadow-lg">
            {colorIds.map((colorId) => {
              const color = colors[colorId];
              return (
                <li
                  key={color.id}
                  className="block w-20 cursor-pointer rounded-md p-1 hover:bg-slate-200 hover:shadow-md"
                >
                  <ColorSwatch color={color} onClick={() => handleColorPicker(color.id)} label={color.name} />
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

interface IColorSwatchProps {
  color: IColor;
  label?: string;
  onClick: () => void;
}
const ColorSwatch: React.FC<IColorSwatchProps> = ({ color, label, onClick }) => (
  <div onClick={onClick} className="flex h-24 w-full cursor-pointer flex-col items-center justify-between py-1">
    <div
      style={{ backgroundColor: `rgb(${color.cloth.rgb.join(',')})` }}
      className="h-16 w-full shrink-0 rounded-sm"
    ></div>
    <div className="leading-0 max-w-full  px-2 text-center text-xs">{label ?? color.name}</div>
  </div>
);

interface ILayerPreviewProps {
  url: string | null;
  size: string;
  onClick: () => void;
  onPrev: () => void;
  onNext: () => void;
  onClear: () => void;
  onRandom: () => void;
}
const LayerPreview: React.FC<ILayerPreviewProps> = ({ url, size, onClick, onPrev, onNext, onClear, onRandom }) => (
  <div className="rounded-md bg-slate-200">
    <div className="cursor-pointer" onClick={onClick}>
      {url ? <img src={url} width={size} height={size} /> : <MdBlock size={size} opacity=".2" />}
    </div>
    <div className="mx-auto flex flex-row justify-center gap-1 text-xl">
      <MdArrowLeft title="Previous" onClick={onPrev} className="cursor-pointer" />
      <MdClear title="Clear" onClick={onClear} className="cursor-pointer" />
      <MdMenu title="Pick" onClick={onClick} className="cursor-pointer" />
      <MdShuffle title="Random" onClick={onRandom} className="cursor-pointer" />
      <MdArrowRight title="Next" onClick={onNext} className="cursor-pointer" />
    </div>
  </div>
);

const LayerOptions: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex shrink-0 flex-col gap-4 px-1">{children}</div>
);

interface IFlagToggleProps {
  icon: React.ReactElement;
  label: React.ReactNode;
  isEnabled: boolean;
  onClick: () => void;
}
const FlagToggle: React.FC<IFlagToggleProps> = ({ icon, label, isEnabled, onClick }) => {
  const CheckboxIcon = isEnabled ? MdCheckBox : MdCheckBoxOutlineBlank;

  return (
    <div
      onClick={onClick}
      className={`flex cursor-pointer select-none flex-row items-center gap-2 px-1 text-sm leading-none`}
    >
      <CheckboxIcon size="18" className="" />
      <div className="">{label}</div>
    </div>
  );
};

interface IBgPickerProps {
  emblem: IGuildEmblem;
  onChange: (emblem: IGuildEmblem) => void;
}
const BgPicker: React.FC<IBgPickerProps> = ({ onChange, emblem }) => {
  return (
    <div className="fixed top-0 left-0 right-0 flex content-center overflow-auto p-8">
      <ul className="mx-auto flex max-w-3xl flex-wrap  bg-slate-50 p-8 shadow-lg">
        {backgroundIds.map((background_id) => {
          const emblemUrl = getEmblemUrl(
            {
              ...emblem,
              background_id,
            },
            EMBLEM_SWATCH_SIZE
          );

          return (
            <li
              key={background_id}
              className="block cursor-pointer rounded-md p-1 hover:bg-slate-200 hover:shadow-md"
              onClick={() => onChange({ background_id })}
            >
              <img src={emblemUrl} width={EMBLEM_SWATCH_SIZE} height={EMBLEM_SWATCH_SIZE} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

interface IFgPickerProps {
  emblem: IGuildEmblem;
  onChange: (emblem: IGuildEmblem) => void;
}
const FgPicker: React.FC<IFgPickerProps> = ({ onChange, emblem }) => {
  return (
    <div className="fixed top-0 left-0 right-0 flex h-screen w-screen content-center rounded-lg p-8">
      <ul className="mx-auto flex max-w-3xl flex-wrap overflow-auto bg-slate-50 p-8 shadow-lg">
        {foregroundIds.map((foreground_id) => {
          const emblemUrl = getEmblemUrl(
            {
              ...emblem,
              foreground_id,
            },
            EMBLEM_SWATCH_SIZE
          );

          return (
            <li
              key={foreground_id}
              className="block cursor-pointer rounded-md p-1 hover:bg-slate-200 hover:shadow-md"
              onClick={() => onChange({ foreground_id })}
            >
              <img src={emblemUrl} width={EMBLEM_SWATCH_SIZE} height={EMBLEM_SWATCH_SIZE} defaultValue="" />
            </li>
          );
        })}
      </ul>
    </div>
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

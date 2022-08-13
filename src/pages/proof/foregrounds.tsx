/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { get } from 'lodash';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import rasterFgs from '~/public/emblem-foregrounds.json';
import { EmblemSVG } from '~/components/EmblemSVG';
import { LayoutMain } from '~/components/layout/Main';
import { Section } from '~/components/layout/Section';
import { DEFAULT_FG_PRIMARY_COLORID, DEFAULT_FG_SECONDARY_COLORID } from '~/lib/emblem/constants';
import { foregrounds } from '~/lib/emblem/resources';
import { getEmblemUrl } from '~/lib/emblem/url';
import { IGuildEmblemForeground } from '~/types/Guild';
import { IReactHTMLElement } from '~/types/ReactHTMLElement';

const RASTER_SIZE = 128;
const VECTOR_SIZE = 256;

const ProofIndex: NextPage = () => {
  return (
    <LayoutMain>
      <Head>
        <link rel="icon" href="/favicon.svg" sizes="any" />
      </Head>
      <div className="mx-auto flex flex-col gap-12">
        <Section className="w-full">
          <div className="flex flex-col gap-4 rounded bg-white p-4 shadow-lg">
            <table className="mx-auto w-fit border-separate border-spacing-2 ">
              <thead>
                <tr className="">
                  <TableHeaderCell>id</TableHeaderCell>
                  <TableHeaderCell colSpan={2}>raster source layers</TableHeaderCell>
                  <TableHeaderCell>inline svg</TableHeaderCell>
                  <TableHeaderCell>api image output</TableHeaderCell>
                </tr>
              </thead>
              <tbody className="divide divide-y divide-red-700">
                {rasterFgs.map((raster) => {
                  const layers = raster.layers;
                  const emblem: IGuildEmblemForeground = {
                    foreground_id: raster.id,
                    foreground_primary_color_id: DEFAULT_FG_PRIMARY_COLORID,
                    foreground_secondary_color_id: DEFAULT_FG_SECONDARY_COLORID,
                  };
                  const emblemUrl = getEmblemUrl(emblem, VECTOR_SIZE.toString());

                  return (
                    <React.Fragment key={`${raster.id}`}>
                      {layers.map((layer, ixLayer) => {
                        return (
                          <tr key={`${raster.id}-${ixLayer}`} className="">
                            {ixLayer === 0 && (
                              <td rowSpan={layers.length + 1} className="p-2 text-right align-top">
                                <a id={`${raster.id}`}>{raster.id}</a>
                              </td>
                            )}
                            <td className="bg-gradient-to-br from-neutral-50 to-neutral-900 p-2 hover:bg-gradient-to-tl">
                              <a href={layer} title="source on white">
                                <Image
                                  width={RASTER_SIZE}
                                  height={RASTER_SIZE}
                                  unoptimized
                                  loading="lazy"
                                  src={layer}
                                />
                              </a>
                            </td>
                            <td className="bg-gradient-to-br from-neutral-50 to-neutral-900 p-2 hover:bg-gradient-to-tl">
                              <a href={layer} title="inverted on black">
                                <Image
                                  width={RASTER_SIZE}
                                  height={RASTER_SIZE}
                                  unoptimized
                                  loading="lazy"
                                  className="invert"
                                  src={layer}
                                />
                              </a>
                            </td>
                            {ixLayer === 0 && (
                              <>
                                <td
                                  rowSpan={layers.length}
                                  className="bg-gradient-to-br from-neutral-50 to-neutral-900 p-2 hover:bg-gradient-to-tl"
                                >
                                  <a href={emblemUrl} title="celestial on black">
                                    <EmblemSVG
                                      emblem={{ foreground_id: raster.id, size: VECTOR_SIZE }}
                                      style={{ width: VECTOR_SIZE, height: VECTOR_SIZE }}
                                    />
                                  </a>
                                </td>
                                <td
                                  rowSpan={layers.length}
                                  className="bg-gradient-to-br from-neutral-50 to-neutral-900 p-2 hover:bg-gradient-to-tl"
                                >
                                  <a href={emblemUrl} title="celestial on black">
                                    <Image
                                      src={emblemUrl}
                                      width={VECTOR_SIZE}
                                      height={VECTOR_SIZE}
                                      unoptimized
                                      layout="fixed"
                                      loading="lazy"
                                    />
                                  </a>
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                      <tr>
                        <td colSpan={4} className="max-w-full p-2">
                          <pre className="max-w-xl overflow-y-clip overflow-x-scroll text-[8px] leading-none">
                            {JSON.stringify(get(foregrounds, raster.id), null, 2)}
                          </pre>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>
      </div>
    </LayoutMain>
  );
};

const TableHeaderCell: React.FC<IReactHTMLElement<HTMLTableCellElement> & { colSpan?: number }> = ({
  children,
  className,
  ...attrs
}) => (
  <th {...attrs} className={`sticky top-0 z-10 bg-neutral-50 p-4 text-xl font-extralight shadow  ${className}`}>
    {children}
  </th>
);

export default ProofIndex;

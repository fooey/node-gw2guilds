/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import rasterBgs from '~/public/emblem-backgrounds.json';
import { LayoutMain } from '~/components/layout/Main';
import { Section, SectionTitle } from '~/components/layout/Section';
import { DEFAULT_BG_COLORID } from '~/lib/emblem/constants';
import { IReactHTMLElement } from '~/types/ReactHTMLElement';

const ProofIndex: NextPage = () => {
  return (
    <LayoutMain>
      <Head>
        <link rel="icon" href="/favicon.svg" sizes="any" />
      </Head>
      <div className="mx-auto flex max-w-4xl flex-col gap-12">
        <Section className="w-full">
          <SectionTitle>background proofs</SectionTitle>
          <div className="flex flex-col gap-4 rounded bg-white p-4 shadow-lg">
            <table className="mx-auto w-fit border-separate border-spacing-2 ">
              <thead>
                <tr className="">
                  <TableHeaderCell>id</TableHeaderCell>
                  <TableHeaderCell colSpan={2}>raster source</TableHeaderCell>
                  <TableHeaderCell colSpan={2}>vectorized output</TableHeaderCell>
                </tr>
              </thead>
              <tbody className="divide divide-y divide-red-700">
                {rasterBgs.map((rasterBg) => {
                  return (
                    <tr key={rasterBg.id} className="">
                      <td className="p-2 text-right align-top">{rasterBg.id}</td>
                      <td className="bg-white p-2">
                        <a href={rasterBg.layers[0]} title="source on white">
                          <Image width={128} height={128} unoptimized loading="lazy" src={rasterBg.layers[0]} />
                        </a>
                      </td>
                      <td className="bg-black p-2">
                        <a href={rasterBg.layers[0]} title="inverted on black">
                          <Image
                            width={128}
                            height={128}
                            unoptimized
                            loading="lazy"
                            className="invert"
                            src={rasterBg.layers[0]}
                          />
                        </a>
                      </td>
                      <td className="bg-white p-2">
                        <a
                          href={`/api/emblem?background_id=${rasterBg.id}&size=128&background_color_id=${DEFAULT_BG_COLORID}`}
                          title="abyss on white"
                        >
                          <img
                            src={`/api/emblem?background_id=${rasterBg.id}&size=128&background_color_id=${DEFAULT_BG_COLORID}`}
                            width={128}
                            height={128}
                          />
                        </a>
                      </td>
                      <td className="bg-black p-2">
                        <a
                          href={`/api/emblem?background_id=${rasterBg.id}&size=128&background_color_id=6`}
                          title="celestial on black"
                        >
                          <img
                            src={`/api/emblem?background_id=${rasterBg.id}&size=128&background_color_id=6`}
                            width={128}
                            height={128}
                          />
                        </a>
                      </td>
                    </tr>
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

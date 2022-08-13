/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { LayoutMain } from '~/components/layout/Main';

const ProofIndex: NextPage = () => {
  return (
    <LayoutMain>
      <Head>
        <link rel="icon" href="/favicon.svg" sizes="any" />
      </Head>
      <div className="mx-auto flex max-w-4xl flex-col gap-12">
        <h1>proofs</h1>
        <ul>
          <li>
            <Link href={'/proof/backgrounds'}>backgrounds</Link>
          </li>
          <li>
            <Link href={'/proof/foregrounds'}>foregrounds</Link>
          </li>
        </ul>
      </div>
    </LayoutMain>
  );
};

export default ProofIndex;

/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { LayoutMain } from '~/components/layout/Main';

type IProofProps = {};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {},
  };
};

const Proof: NextPage<IProofProps> = () => {
  return (
    <LayoutMain>
      <Head>
        <link rel="icon" href="/favicon.svg" sizes="any" />
      </Head>
      <div className="mx-auto flex max-w-4xl flex-col gap-12">
        <h1>proof</h1>
      </div>
    </LayoutMain>
  );
};

export default Proof;

import type { NextPage } from 'next';
import Head from 'next/head';
import { LayoutMain } from '~/components/layout/Main';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>g2w2w2 guild emblems</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LayoutMain>
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
      </LayoutMain>
    </>
  );
};

export default Home;

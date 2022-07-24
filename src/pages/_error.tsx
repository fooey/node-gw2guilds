import { NextPage, NextPageContext } from 'next';
import Head from 'next/head';
import { LayoutMain } from '~/components/layout/Main';

interface Props {
  statusCode?: number;
}

const Error: NextPage<Props> = ({ statusCode }) => {
  return (
    <LayoutMain>
      <Head>
        <title>Error</title>
      </Head>
      <div className="mx-auto flex max-w-4xl flex-col gap-12">
        <h1 className="text-4xl">Error</h1>
        <p>{statusCode ? `An error ${statusCode} occurred on server` : 'An error occurred on client'}</p>;
      </div>
    </LayoutMain>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;

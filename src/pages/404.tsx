import Head from 'next/head';
import { LayoutMain } from '~/components/layout/Main';

export default function Custom404() {
  return (
    <LayoutMain>
      <Head>
        <title>Not Found</title>
      </Head>
      <div className="mx-auto flex max-w-4xl flex-col gap-12">
        <h1 className="text-4xl">Not Found</h1>
      </div>
    </LayoutMain>
  );
}

import { DateTime } from 'luxon';
import type { AppProps } from 'next/app';
import '~/styles/globals.css';

function MyApp({ Component, pageProps, router }: AppProps) {
  console.info(DateTime.now().toISO(), router.pathname, router.query);
  return <Component {...pageProps} />;
}

export default MyApp;

import {
  App
} from 'konsta/react';
import Head from 'next/head';
import '../styles/globals.css'

function MyApp({
  Component,
  pageProps
}) {
  return (<App theme="material" safeAreas>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover" />
    </Head>
    <Component {...pageProps} />
  </App>)
}

export default MyApp

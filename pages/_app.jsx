import {
  App
} from 'konsta/react';

import '../styles/globals.css'

function MyApp({
  Component,
  pageProps
}) {
  return (<App theme="material" safeAreas>
    <Component {...pageProps} />
  </App>)
}

export default MyApp

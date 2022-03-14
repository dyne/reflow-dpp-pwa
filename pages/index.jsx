import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Reflow DPP App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.title}>
        Welcome to <a href="https://reflowos.dyne.org">Reflow</a> DPP App
      </h1>

      <p className={styles.description}>
        This app is ment to verify and generate Digital product passports part of the <a href="https://reflowproject.eu"> Reflow project </a>
      </p>

      <div className={styles.grid}>
        <a href="/generate" className={styles.card}>
          <h2>Generate &rarr;</h2>
          <p>Generate a Digital Product Passport and a QR Code</p>
        </a>

        <a href="/verify" className={styles.card}>
          <h2>Verify &rarr;</h2>
          <p>Verify the information by scanning the QR Code</p>
        </a>
      </div>

      <footer className={styles.footer}>
        <a
          href="https://dyne.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            Dyne.org
          </span>
        </a>
        {/* < small > and European Union 's Horizon 2020 research and innovation programme under grant agreement No 820937</small> */}
      </footer>
    </div>
  )
}

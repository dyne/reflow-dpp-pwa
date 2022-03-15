import Head from 'next/head'
import Link from 'next/link'
import { Page, Navbar } from 'konsta/react'

export default function Home() {
  return (
    <Page>
      <Navbar
        title="Reflow DPP APP"
      />
      <Head>
        <title>Reflow DPP App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="px-2 my-3 text-2xl font-bold text-center">
        🤗 to the <a href="https://reflowos.dyne.org" target="_blank" rel="noopener noreferrer" className="text-green-400">Reflow</a> DPP App
      </h1>

      <p className="p-4 m-3 text-sm">
        This app is ment to verify and generate Digital product passports part of the <a href="https://reflowproject.eu" target="_blank" rel="noopener noreferrer"> Reflow project </a>
      </p>

      <div className="flex flex-col ">
        <div className="max-w-md p-8 m-4 bg-white border rounded-lg shadow hover:text-green-400 hover:border-green-400 hover:shadow-xl">
          <Link href="/generate">
            <a>
              <h2 className="text-3xl font-semibold">Generate &rarr;</h2>
              <p className="mt-2 text-xl">Generate a Digital Product Passport and a QR Code</p>
            </a>
          </Link>
        </div>

        <div className="max-w-md p-8 m-4 bg-white border rounded-lg shadow hover:text-green-400 hover:border-green-400 hover:shadow-xl">
          <Link href="/verify">
            <a>
              <h2 className="text-3xl font-semibold">Verify &rarr;</h2>
              <p className="mt-2 text-xl">Verify the information by scanning the QR Code</p>
            </a>
          </Link>
        </div>
      </div>

      <footer className="p-4 text-center">
        <span>Powered by <a target="_blank" rel="noopener noreferrer" href="https://dyne.org" className="font-medium text-green-300 hover:underline font-dyne">Dyne.org</a>.
        </span>
      </footer>
    </Page>
  )
}

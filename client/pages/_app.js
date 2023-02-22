import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import Head from 'next/head';
import { MainLayout } from '../src/components'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Four Leaf</title>
        <meta name="description" content="Lottery Dapp Four-Leafs" />
      </Head>
      <MainLayout class='bgColor'>
        <Component {...pageProps} />
      </MainLayout>
    </>
  )
}

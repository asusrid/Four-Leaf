import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import Head from 'next/head';
import { MainLayout } from '../src/components'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Four-Leaf</title>
        <link rel = "icon" href ="/logo.svg" type = "image/x-icon"></link>
        <meta charSet="utf-8" />
        <meta name="description" content="Invest in crypto by betting on numbers in this lottery app using Blockchain, which provides trust, transparency and instantaneity to you" />
        {/* <meta name="google-site-verification" content="+nxGUDJ4QpAZ5l9Bsjdi102tLVC21AIh5d1Nl23908vVuFHs34=" /> */}
        {/* <meta name="robots" content="noindex,nofollow" /> */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link href="https://fonts.googleapis.com/css2?family=M+PLUS+2:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet"></link>
      </Head>
      <MainLayout class='bgColor'>
        <Component {...pageProps} />
      </MainLayout>
    </>
  )
}

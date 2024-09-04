import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <link rel="apple-touch-icon" sizes="180x180" href="/lockandhammer.png" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="apple-mobile-web-app-title" content="L&H PICKS" />
                <title>Lock & Hammer Picks</title>
            </Head>
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;

import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                {/* Apple specific meta tags */}
                <link rel="apple-touch-icon" sizes="180x180" href="/lockandhammer.png" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="apple-mobile-web-app-title" content="L&H PICKS" />
                <meta name="format-detection" content="telephone=no" /> {/* Disable auto phone number detection */}
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" /> {/* Optimizes the view on mobile */}

                {/* Additional app metadata */}
                <meta name="theme-color" content="#000000" /> {/* Sets the theme color for the status bar */}
                <meta name="description" content="Lock & Hammer Picks - Dominate, Crush, Conquer in sports betting with our expert picks." />
                <title>Lock & Hammer Picks</title>

                {/* PWA manifest (optional) */}
                <link rel="manifest" href="/manifest.json" /> {/* If you are using PWA functionality */}
            </Head>
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;

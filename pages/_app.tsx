import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                {/* Apple-specific meta tags */}
                <link rel="apple-touch-icon" sizes="180x180" href="/lockandhammer.png" />  {/* App icon for Apple devices */}
                <meta name="apple-mobile-web-app-capable" content="yes" />  {/* Enable standalone app mode on iOS */}
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />  {/* Black status bar style */}
                <meta name="apple-mobile-web-app-title" content="L&H PICKS" />  {/* App title for iOS */}
                <meta name="format-detection" content="telephone=no" />  {/* Disable auto-detection of phone numbers */}
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />  {/* Optimized view for mobile, prevent zooming */}

                {/* General Meta Tags for SEO and App Optimization */}
                <meta name="theme-color" content="#000000" />  {/* Theme color for status bars on Android/Windows */}
                <meta name="description" content="Lock & Hammer Picks - Dominate, Crush, Conquer in sports betting with our expert picks." />  {/* SEO Description */}

                {/* Favicon */}
                <link rel="icon" href="/lockandhammer.png" type="image/png" sizes="32x32" />  {/* General favicon for desktop */}

                {/* PWA Configuration */}
                <link rel="manifest" href="/manifest.json" />  {/* Manifest for PWA */}

                {/* Title */}
                <title>Lock & Hammer Picks - Dominate, Crush, Conquer</title>  {/* Professional title for both SEO and appearance */}

                {/* Open Graph Meta Tags for Social Sharing */}
                <meta property="og:title" content="Lock & Hammer Picks - Dominate, Crush, Conquer" />
                <meta property="og:description" content="Get expert sports betting picks with Lock & Hammer. Take your game to the next level." />
                <meta property="og:image" content="/lockandhammer.png" />  {/* Social sharing image */}
                <meta property="og:url" content="https://lockandhammerpicks.vercel.app" />  {/* URL for social sharing */}
                <meta name="twitter:card" content="summary_large_image" />  {/* Twitter card config */}
            </Head>
            <Component {...pageProps} />
        </>
    );
}

export default MyApp;

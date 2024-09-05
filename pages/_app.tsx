import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter();

    useEffect(() => {
        // Check if the user has visited the intro page before
        const hasVisitedIntro = localStorage.getItem('visitedIntro');

        // If the intro page hasn't been visited, redirect to '/intro'
        if (!hasVisitedIntro && router.pathname !== '/intro') {
            router.push('/intro');
        }
    }, [router]);

    return (
        <>
            <Head>
                {/* Logo icons */}
                <link rel="apple-touch-icon" sizes="180x180" href="/lockandhammer.png" />  {/* App icon for Apple devices */}

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

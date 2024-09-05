import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import IntroPage from './intro';
import Layout from '../components/layout';

function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const [showIntro, setShowIntro] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkIntroVisited = () => {
            const visitedIntro = localStorage.getItem('visitedIntro');
            if (visitedIntro) {
                setShowIntro(false);
            } else {
                setShowIntro(true);
                if (router.pathname !== '/intro') {
                    router.push('/intro');
                }
            }
            setIsLoading(false);
        };

        checkIntroVisited();

        const handleRouteChange = () => {
            checkIntroVisited();
        };

        router.events.on('routeChangeComplete', handleRouteChange);

        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router]);

    const handleIntroComplete = () => {
        localStorage.setItem('visitedIntro', 'true');
        setShowIntro(false);
        router.push('/');
    };

    if (isLoading) {
        return null; // or a loading spinner
    }

    return (
        <>
            <Head>
                <link rel="apple-touch-icon" sizes="180x180" href="/lockandhammer.png" />
                <meta name="theme-color" content="#000000" />
                <meta name="description" content="Lock & Hammer Picks - Dominate, Crush, Conquer in sports betting with our expert picks." />
                <link rel="icon" href="/lockandhammer.png" type="image/png" sizes="32x32" />
                <link rel="manifest" href="/manifest.json" />
                <title>Lock & Hammer Picks - Dominate, Crush, Conquer</title>
            </Head>
            {showIntro ? (
                <IntroPage onComplete={handleIntroComplete} />
            ) : (
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            )}
        </>
    );
}

export default MyApp;
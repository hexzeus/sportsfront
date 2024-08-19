// pages/_app.tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app'; // Import the AppProps type from Next.js

function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}

export default MyApp;

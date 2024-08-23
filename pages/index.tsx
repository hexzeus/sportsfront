import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Layout from '../components/layout';
import { useEffect, useState } from 'react';
import Image from 'next/image';

// Redirect users to the intro page on page load
export const getServerSideProps: GetServerSideProps = async () => {
    return {
        redirect: {
            destination: '/intro', // Redirect to the intro page
            permanent: false, // Temporary redirect
        },
    };
};

const HomePage: React.FC = () => {
    const [animated, setAnimated] = useState(false);
    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    useEffect(() => {
        setAnimated(true);

        // Update the time every second
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);

        // Clean up the timer on component unmount
        return () => {
            clearInterval(timer);
        };
    }, []);

    const formattedTime = currentTime
        ? currentTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        })
        : null;

    return (
        <Layout>
            {/* Main Content */}
            <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-black via-falcons-black to-falcons-red text-white transition-all duration-1000 opacity-100">
                <main className="flex-grow flex flex-col items-center justify-center text-center space-y-10 px-6 sm:px-8 md:px-12">
                    <div className={`bg-opacity-80 bg-black rounded-3xl p-6 sm:p-8 md:p-16 shadow-2xl transform transition-transform duration-1000 ${animated ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                        <div className="flex flex-col items-center space-y-6">
                            <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32">
                                <Image
                                    src="/falcon-logo.png"
                                    alt="Atlanta Falcons Logo"
                                    width={128}
                                    height={128}
                                    priority
                                    className="drop-shadow-xl"
                                />
                            </div>

                            {formattedTime && (
                                <div className="bg-gray-900 text-falcons-red font-mono text-3xl sm:text-4xl md:text-5xl py-3 sm:py-4 px-6 sm:px-8 md:px-10 rounded-lg shadow-lg tracking-widest animate-glow">
                                    {formattedTime}
                                </div>
                            )}
                        </div>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-wider text-falcons-red uppercase leading-tight drop-shadow-lg animate-fadeIn">
                        Falcons Rise Up
                    </h1>
                    <p className="text-lg sm:text-xl md:text-3xl text-gray-300 tracking-wide leading-relaxed max-w-screen-sm md:max-w-screen-md">
                        Every Play. Every Bet. Every Victory. Let’s turn passion into power on the field.
                    </p>

                    <Link href="/bets" className="inline-block bg-falcons-red text-white text-lg sm:text-xl md:text-2xl font-semibold py-3 sm:py-4 px-8 sm:px-10 rounded-full shadow-xl hover:bg-black hover:text-falcons-silver transition duration-300 transform hover:scale-105 hover:shadow-2xl">
                        Join the Action
                    </Link>
                </main>

                <footer className="w-full text-center py-10 sm:py-12 bg-black bg-opacity-50">
                    <Link href="/disclaimer" className="text-sm sm:text-base text-gray-400 hover:text-gray-200 transition duration-300">
                        Disclaimer
                    </Link>
                </footer>

                {/* Background Elements for Subtle Depth */}
                <div className="absolute inset-0 z-[-1] overflow-hidden">
                    <div className="absolute top-1/3 left-1/4 w-40 h-40 sm:w-48 sm:h-48 md:w-60 md:h-60 bg-gradient-to-r from-falcons-red to-yellow-400 rounded-full blur-3xl opacity-40 animate-pulse"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-44 h-44 sm:w-56 sm:h-56 md:w-72 md:h-72 bg-gradient-to-r from-gray-800 to-black rounded-full blur-3xl opacity-40"></div>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;

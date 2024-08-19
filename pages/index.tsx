import Link from 'next/link';
import Layout from '../components/layout';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const HomePage: React.FC = () => {
    const [animated, setAnimated] = useState(false);
    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    useEffect(() => {
        setAnimated(true);

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
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
            <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-black via-falcons-black to-falcons-red text-white relative overflow-hidden">
                <div
                    className={`flex-grow flex flex-col items-center justify-center text-center transform transition-all duration-700 ${animated ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                        }`}
                >
                    {/* Scoreboard Container */}
                    <div className="bg-black bg-opacity-80 rounded-3xl p-6 md:p-12 shadow-2xl relative mb-12">
                        <div className="flex flex-col items-center justify-center space-y-4 md:space-y-6">
                            {/* Falcons Logo */}
                            <div className="w-24 h-24 relative">
                                <Image
                                    src="/falcon-logo.png"
                                    alt="Atlanta Falcons Logo"
                                    width={100}
                                    height={100}
                                    priority
                                />
                            </div>

                            {/* Real-Time Clock */}
                            {formattedTime && (
                                <div className="bg-gray-900 text-falcons-red font-mono text-3xl md:text-5xl py-2 px-6 md:py-4 md:px-8 rounded-lg shadow-lg tracking-widest glow-text">
                                    {formattedTime}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Optimized H1 for Readability & Impact */}
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-wide text-falcons-red uppercase leading-tight">
                        Falcons Rise Up
                    </h1>
                    <p className="text-lg md:text-2xl mb-8 font-medium text-gray-300 tracking-wide">
                        Every Play. Every Bet. Every Victory.
                    </p>

                    <nav className="mt-8">
                        <Link href="/bets">
                            <span className="inline-block bg-falcons-red text-white text-lg md:text-xl font-semibold py-3 px-6 md:py-4 md:px-8 rounded-full shadow-lg hover:bg-black hover:text-falcons-silver transform transition-all duration-300">
                                Get Started
                            </span>
                        </Link>
                    </nav>
                </div>

                {/* Footer with Links */}
                <footer className="w-full text-center mt-12 mb-4">
                    <div className="flex flex-col items-center space-y-4">
                        <Link href="/disclaimer">
                            <span className="text-sm text-gray-400 hover:text-gray-200 transition duration-300">Disclaimer</span>
                        </Link>
                    </div>
                </footer>

                {/* Background Elements for Subtle Depth */}
                <div className="absolute top-0 left-0 w-full h-full z-[-1]">
                    <div className="absolute top-1/4 left-1/3 w-48 md:w-72 h-48 md:h-72 bg-gradient-to-r from-falcons-red to-yellow-400 rounded-full mix-blend-overlay blur-2xl opacity-40"></div>
                    <div className="absolute bottom-1/4 right-1/3 w-60 md:w-80 h-60 md:h-80 bg-gradient-to-r from-gray-800 to-black rounded-full mix-blend-overlay blur-3xl opacity-40"></div>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;

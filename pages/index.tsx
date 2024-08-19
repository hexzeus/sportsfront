import Link from 'next/link';
import Layout from '../components/layout';
import { useEffect, useState } from 'react';

const HomePage: React.FC = () => {
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        setAnimated(true); // Trigger the entrance animation when the component loads
    }, []);

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-r from-black to-falcons-red text-white flex items-center justify-center relative overflow-hidden">
                <div
                    className={`container mx-auto p-6 md:p-8 text-center transform transition-all duration-700 ${animated ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                        }`}
                >
                    {/* Optimized H1 for Mobile & Desktop */}
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-red-500 via-yellow-400 to-white bg-clip-text text-transparent uppercase leading-tight">
                        Elevate Your Game
                    </h1>
                    <p className="text-lg md:text-2xl mb-8 font-light tracking-wide text-gray-200">
                        Precision. Strategy. Every Bet Counts.
                    </p>

                    <nav className="mt-8">
                        <Link href="/bets">
                            <span className="inline-block bg-falcons-red text-white text-lg md:text-xl font-semibold py-3 px-6 md:py-4 md:px-8 rounded-full shadow-md hover:bg-red-700 hover:text-yellow-300 transform transition-all duration-300">
                                Get Started
                            </span>
                        </Link>
                    </nav>
                </div>

                {/* Background Elements for Smoothness */}
                <div className="absolute top-0 left-0 w-full h-full z-[-1]">
                    <div className="absolute top-1/4 left-1/4 w-40 md:w-64 h-40 md:h-64 bg-gradient-to-r from-falcons-red to-yellow-400 rounded-full mix-blend-overlay blur-2xl opacity-30"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-48 md:w-72 h-48 md:h-72 bg-gradient-to-r from-gray-800 to-black rounded-full mix-blend-overlay blur-2xl opacity-30"></div>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;

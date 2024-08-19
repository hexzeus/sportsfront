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
                    className={`container mx-auto p-8 text-center transform transition-all duration-700 ${animated ? 'translate-y-0 opacity-100 animate-fadeIn' : 'translate-y-20 opacity-0'
                        }`}
                >
                    {/* Enhanced H1 for better readability */}
                    <h1 className="text-7xl md:text-8xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-red-500 via-yellow-400 to-white bg-clip-text text-transparent animate-textGlow uppercase leading-tight drop-shadow-2xl">
                        Elevate Your Game
                    </h1>
                    <p className="text-2xl md:text-3xl mb-12 font-light tracking-wider text-gray-200 animate-fadeIn">
                        Precision. Strategy. Every Bet Counts.
                    </p>

                    <nav className="mt-8">
                        <Link href="/bets">
                            <span className="inline-block bg-falcons-red text-white text-xl md:text-2xl font-semibold py-4 px-10 rounded-full shadow-xl hover:bg-red-700 hover:text-yellow-300 transform hover:scale-110 transition-all animate-zoom-in">
                                Get Started
                            </span>
                        </Link>
                    </nav>
                </div>

                {/* Enhanced Background animations */}
                <div className="absolute top-0 left-0 w-full h-full z-[-1]">
                    <div className="absolute top-1/4 left-1/4 w-64 md:w-80 h-64 md:h-80 bg-gradient-to-r from-falcons-red to-yellow-400 rounded-full mix-blend-overlay blur-3xl opacity-40 animate-pulse-fast"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-80 md:w-96 h-80 md:h-96 bg-gradient-to-r from-gray-800 to-black rounded-full mix-blend-overlay blur-3xl opacity-40 animate-pulse-slow"></div>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;

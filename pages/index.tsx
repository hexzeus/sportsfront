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
                    <h1 className="text-6xl font-extrabold mb-6 tracking-wider bg-gradient-to-r from-falcons-red to-black bg-clip-text text-transparent animate-textGlow uppercase">
                        Welcome to Sports Mania
                    </h1>
                    <p className="text-2xl mb-12 font-light tracking-widest text-gray-200 animate-fadeIn">
                        Your ultimate sports betting companion. Bet big, win big!
                    </p>

                    <nav className="mt-8">
                        <Link href="/bets">
                            <span className="inline-block bg-falcons-red text-white text-xl font-semibold py-4 px-10 rounded-full shadow-lg hover:bg-red-700 hover:text-yellow-300 transform hover:scale-105 transition-all animate-zoom-in">
                                Explore Bets
                            </span>
                        </Link>
                    </nav>
                </div>

                {/* Background animations */}
                <div className="absolute top-0 left-0 w-full h-full z-[-1]">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-falcons-red rounded-full mix-blend-overlay blur-3xl opacity-30 animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-black rounded-full mix-blend-overlay blur-3xl opacity-30 animate-pulse"></div>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;

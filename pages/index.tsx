import Link from 'next/link';
import Layout from '../components/layout';
import { useEffect, useState } from 'react';
import Image from 'next/image'; // Import Next.js Image component

const HomePage: React.FC = () => {
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        setAnimated(true); // Trigger the entrance animation when the component loads
    }, []);

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-black via-falcons-black to-falcons-red text-white flex items-center justify-center relative overflow-hidden">
                <div
                    className={`container mx-auto p-6 md:p-8 text-center transform transition-all duration-700 ${animated ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                        }`}
                >
                    {/* Atlanta Falcons Logo */}
                    <div className="flex justify-center mb-8">
                        <Image
                            src="/falcon-logo.png" // Path to the image in the public folder
                            alt="Atlanta Falcons Logo"
                            width={150} // Adjust the width as per your preference
                            height={150} // Adjust the height as per your preference
                            priority // Ensures the image loads quickly
                        />
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

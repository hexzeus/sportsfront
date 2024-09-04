import React from 'react';
import Layout from '../components/layout';
import Simulation from '../components/Simulation';
import SportsAnalysisButton from '../components/SportsAnalysisButton';
import Link from 'next/link';
import { AlertCircle, Skull, Flame, Zap, Trophy, ArrowRight } from 'lucide-react';
import { GetServerSideProps } from 'next';

// GetServerSideProps to check for the intro cookie
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const hasVisitedIntro = req.cookies.visitedIntro;

    // If the cookie does not exist, redirect to the intro page
    if (!hasVisitedIntro) {
        return {
            redirect: {
                destination: '/intro',
                permanent: false,
            },
        };
    }

    return { props: {} }; // No props needed, just render the homepage if cookie exists
};

const HomePage: React.FC = () => {
    return (
        <Layout>
            <div className="min-h-screen flex flex-col justify-between bg-zinc-900 text-zinc-100 transition-all duration-1000 opacity-100 overflow-hidden">
                {/* Background styling */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-800"></div>
                    <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                        <filter id="noise">
                            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                            <feColorMatrix type="saturate" values="0" />
                        </filter>
                        <rect width="100%" height="100%" filter="url(#noise)" />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 via-transparent to-orange-700/20"></div>
                    <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                <main className="relative z-10 flex-grow flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8 px-4 sm:px-6 md:px-8 py-8 sm:py-12">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 uppercase tracking-tighter drop-shadow-glow" style={{ fontFamily: 'Impact, sans-serif' }}>
                        Lock & Hammer Picks
                        <span className="block h-1 w-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 mt-2"></span>
                    </h1>

                    <p className="text-lg sm:text-xl md:text-2xl text-zinc-300 font-bold tracking-wide leading-tight max-w-screen-sm md:max-w-screen-md" style={{ fontFamily: 'Arial Black, sans-serif' }}>
                        <span className="text-red-500">DOMINATE.</span> <span className="text-orange-500">CRUSH.</span> <span className="text-yellow-500">CONQUER.</span>
                    </p>

                    <div className="flex justify-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                        {[Skull, Flame, Zap].map((Icon, index) => (
                            <Icon
                                key={index}
                                className="w-10 h-10 sm:w-12 sm:h-12 text-zinc-300 animate-pulse"
                                style={{ animationDelay: `${index * 150}ms` }}
                            />
                        ))}
                    </div>

                    {/* Bets Button */}
                    <Link
                        href="/bets"
                        className="group relative inline-flex items-center justify-center px-6 py-4 sm:px-8 sm:py-5 overflow-hidden text-base sm:text-lg font-extrabold text-white uppercase tracking-widest transition-all duration-500 ease-out bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 rounded-full shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-red-600 focus:ring-opacity-50 transform hover:scale-105 hover:-translate-y-1"
                    >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-black via-gray-800 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"></span>
                        <span className="absolute inset-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8cGF0aCBkPSJNMCA1TDUgMFpNNiA0TDQgNlpNLTEgMUwxIC0xWiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utb3BhY2l0eT0iMC4yIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] opacity-10"></span>
                        <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black to-gray-900 opacity-10 transform scale-150 group-hover:scale-100 transition-transform duration-500 ease-out"></span>
                        <span className="relative z-10 flex items-center space-x-2">
                            <Trophy className="w-6 h-6 text-yellow-300 animate-bounce" />
                            <Flame className="w-6 h-6 text-orange-400 animate-pulse" />
                            <span className="font-black tracking-widest text-shadow-lg">Unleash Our Picks</span>
                            <ArrowRight className="w-6 h-6 ml-1 transform group-hover:translate-x-2 transition-transform duration-300 ease-out" />
                        </span>
                        <span className="absolute inset-0 w-full h-full border-2 border-white opacity-0 group-hover:opacity-10 rounded-full scale-105 group-hover:scale-100 transition-all duration-500 ease-out"></span>
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 blur-xl transform -skew-x-12 group-hover:skew-x-12 transition-all duration-1000 ease-out"></span>
                    </Link>

                    {/* Simulation and Sports Analysis Button components */}
                    <Simulation />
                    <SportsAnalysisButton />
                </main>

                {/* Sleek Ultra Pro Footer */}
                <footer className="relative z-10 w-full text-center py-5 sm:py-6 bg-gradient-to-r from-zinc-900 via-black to-zinc-800 text-zinc-300">
                    <div className="flex justify-center items-center space-x-4 animate-pulse">
                        {[Skull, Flame, Zap].map((Icon, index) => (
                            <Icon
                                key={index}
                                className={`w-6 h-6 sm:w-8 sm:h-8 text-zinc-300 ${index === 0 ? 'text-red-500' : index === 1 ? 'text-orange-500' : 'text-yellow-500'}`}
                                style={{ animationDelay: `${index * 150}ms` }}
                            />
                        ))}
                    </div>
                    <Link href="/disclaimer" className="block mt-4 text-sm sm:text-base text-zinc-400 hover:text-orange-400 transition duration-300 ease-in-out">
                        <AlertCircle className="inline w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                        Betting Disclaimer
                    </Link>
                </footer>
            </div>
        </Layout>
    );
};

export default HomePage;

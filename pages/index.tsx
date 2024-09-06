import React from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Lock, Flame, Trophy, ArrowRight, Hammer } from 'lucide-react';
import Simulation from '../components/Simulation';
import SportsAnalysisButton from '../components/SportsAnalysisButton';

const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col justify-between bg-black text-white transition-all duration-1000 opacity-100 overflow-hidden relative">
            {/* Bold Sports-Themed Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-black via-dark-blue to-dark-gray h-full"></div>
                <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
                    <pattern id="sportsGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <rect width="50" height="50" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#sportsGrid)" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-slate-900/30 h-full"></div>
            </div>

            {/* Main Content */}


            {/* Main Content */}
            <main className="relative z-10 flex-grow flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8 px-4 sm:px-6 md:px-8 py-8 sm:py-12">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight">
                    <span className="text-shadow-metallic bg-gradient-to-r from-gray-800 via-gray-600 to-gray-400 bg-clip-text text-transparent animate-gradient-shine">
                        Lock & Hammer Picks
                    </span>
                    <span className="block h-1 w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 rounded-lg shadow-sm mt-3"></span>
                </h1>

                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 font-bold tracking-wide leading-tight max-w-screen-sm md:max-w-screen-md" style={{ fontFamily: 'Arial Black, sans-serif' }}>
                    <span className="text-yellow-500">DOMINATE.</span> <span className="text-red-500">CRUSH.</span> <span className="text-gray-300">CONQUER.</span>
                </p>

                <div className="flex justify-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                    {[Lock, Hammer, Trophy].map((Icon, index) => (
                        <Icon
                            key={index}
                            className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-gray-400 animate-pulse"
                            style={{ animationDelay: `${index * 150}ms` }}
                        />
                    ))}
                </div>

                {/* "Bets" Button */}
                <Link
                    href="/bets"
                    className="group relative inline-flex items-center justify-center px-5 py-3 sm:px-7 sm:py-4 lg:px-8 lg:py-5 overflow-hidden text-base sm:text-lg lg:text-xl font-extrabold uppercase tracking-widest transition-all duration-500 ease-out bg-gradient-to-r from-blue-900 via-steel-700 to-gray-500 rounded-full shadow-2xl hover:shadow-3xl focus:outline-none focus:ring-4 focus:ring-blue-700 focus:ring-opacity-50 transform hover:scale-110 hover:-translate-y-1"
                >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-black via-gray-800 to-steel-900 opacity-80 transform skew-x-12 group-hover:skew-x-0 transition-all duration-700 ease-in-out"></span>
                    <span className="relative z-10 flex items-center space-x-2">
                        <Trophy className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-yellow-500 animate-bounce" />
                        <Flame className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-blue-300 animate-pulse" />
                        <span className="font-black tracking-widest text-shadow-md text-gray-200">Unleash Our Picks</span>
                        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 ml-1 transform group-hover:translate-x-2 transition-transform duration-300 ease-out text-gray-300" />
                    </span>
                </Link>

                {/* Simulation and Sports Analysis Button components */}
                <Simulation />
                <SportsAnalysisButton />
            </main>

            {/* Dynamic Betting Disclaimer Footer */}
            <footer className="relative z-10 w-full text-center py-3 sm:py-4 bg-black/80 backdrop-blur-md">
                <Link href="/disclaimer" className="flex items-center justify-center text-xs sm:text-sm text-yellow-500 hover:text-blue-400 transition duration-300 animate-pulse">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span className="text-shadow-lg">
                        Disclaimer
                    </span>
                </Link>
            </footer>
        </div>
    );
};

export default HomePage;
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, BarChart2, Settings, Menu, X, AlertCircle } from 'lucide-react';
import { Skull, Flame, Zap, Trophy, ArrowRight } from 'lucide-react';
import Simulation from '../components/Simulation';
import SportsAnalysisButton from '../components/SportsAnalysisButton';

// Define the navigation items
const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Live Scores', href: '/scores', icon: BarChart2 },
    { name: 'Bets', href: '/bets', icon: BarChart2 },
    { name: 'Admin', href: '/admin', icon: Settings },
];

const HomePage: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="min-h-screen flex flex-col justify-between bg-zinc-900 text-zinc-100 transition-all duration-1000 opacity-100 overflow-hidden relative">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-zinc-900/90 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" passHref legacyBehavior>
                                <a className="flex-shrink-0 flex items-center space-x-2">
                                    <div className="relative w-10 h-10">
                                        <Image
                                            src="/file.png"
                                            alt="L&H Picks Logo"
                                            fill
                                            className="rounded-full"
                                            style={{ objectFit: 'contain' }}
                                        />
                                    </div>
                                    <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-500">
                                        L&H PICKS
                                    </span>
                                </a>
                            </Link>
                        </div>
                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-4">
                            {navItems.map((item) => (
                                <Link href={item.href} key={item.name} className="text-sm font-medium text-gray-300 hover:bg-orange-600/20 hover:text-white px-3 py-2 rounded-md">
                                    <item.icon className="w-5 h-5 inline mr-1" />
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button
                                onClick={toggleMobileMenu}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            >
                                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>
                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-zinc-900 backdrop-blur-md p-4">
                        {navItems.map((item) => (
                            <Link href={item.href} key={item.name} className="block px-4 py-2 text-gray-300 hover:bg-orange-600/20 hover:text-white rounded-md">
                                <item.icon className="w-5 h-5 inline mr-1" />
                                {item.name}
                            </Link>
                        ))}
                    </div>
                )}
            </nav>

            {/* Add margin below navbar */}
            <div className="h-16"></div>

            {/* Background styling with the grid continuing */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-800 h-full"></div>
                <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                    <filter id="noise">
                        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                        <feColorMatrix type="saturate" values="0" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noise)" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 via-transparent to-orange-700/20 h-full"></div>
                <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* Main Content */}
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

                {/* "Bets" Button */}
                <Link
                    href="/bets"
                    className="group relative inline-flex items-center justify-center px-6 py-4 sm:px-8 sm:py-5 overflow-hidden text-base sm:text-lg font-extrabold text-white uppercase tracking-widest transition-all duration-500 ease-out bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 rounded-full shadow-xl hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-red-600 focus:ring-opacity-50 transform hover:scale-105 hover:-translate-y-1"
                >
                    <span className="relative z-10 flex items-center space-x-2">
                        <Trophy className="w-6 h-6 text-yellow-300 animate-bounce" />
                        <Flame className="w-6 h-6 text-orange-400 animate-pulse" />
                        <span className="font-black tracking-widest text-shadow-lg">Unleash Our Picks</span>
                        <ArrowRight className="w-6 h-6 ml-1 transform group-hover:translate-x-2 transition-transform duration-300 ease-out" />
                    </span>
                </Link>

                {/* Simulation and Sports Analysis Button components */}
                <Simulation />
                <SportsAnalysisButton />
            </main>

            {/* Dynamic Betting Disclaimer Footer */}
            <footer className="relative z-10 w-full text-center py-3 sm:py-4 bg-zinc-900/80 backdrop-blur-md">
                <Link href="/disclaimer" className="flex items-center justify-center text-xs sm:text-sm text-zinc-400 hover:text-orange-400 transition duration-300 animate-pulse">
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

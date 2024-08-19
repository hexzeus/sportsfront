import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        setAnimated(true); // Trigger entrance animation for all pages
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-falcons-black via-falcons-red to-black text-white flex flex-col relative overflow-hidden">
            {/* Navigation */}
            <header className="bg-gradient-to-r from-black via-gray-900 to-falcons-red bg-opacity-90 py-4 md:py-6 fixed top-0 w-full z-30 shadow-xl backdrop-filter backdrop-blur-lg border-b border-gray-700">
                <div className="container mx-auto flex justify-between items-center px-4 md:px-6">
                    {/* Animated Logo */}
                    <div className="text-3xl md:text-5xl font-extrabold text-falcons-red tracking-tight uppercase leading-tight drop-shadow-lg transition-all duration-300 hover:scale-105">
                        <Link href="/">
                            <span className="cursor-pointer">Sports Mania</span>
                        </Link>
                    </div>

                    {/* Responsive Navigation Menu */}
                    <nav>
                        <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-8 items-center">
                            <li>
                                <Link href="/" passHref>
                                    <span className="relative text-white uppercase font-bold text-base md:text-lg tracking-wide cursor-pointer transition-all duration-300 hover:text-yellow-400 before:absolute before:-bottom-1 md:before:-bottom-2 before:left-0 before:w-full before:h-0.5 before:bg-yellow-400 before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100">
                                        Dashboard
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/bets" passHref>
                                    <span className="relative text-white uppercase font-bold text-base md:text-lg tracking-wide cursor-pointer transition-all duration-300 hover:text-yellow-400 before:absolute before:-bottom-1 md:before:-bottom-2 before:left-0 before:w-full before:h-0.5 before:bg-yellow-400 before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100">
                                        Fred's Picks
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className={`container mx-auto pt-24 md:pt-28 px-4 md:px-0 transform transition-all duration-1000 ${animated ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                {children}
            </main>

            {/* Background Animations */}
            <div className="absolute top-0 left-0 w-full h-full z-[-1]">
                <div className="absolute top-1/3 left-1/4 w-48 md:w-80 h-48 md:h-80 bg-gradient-to-r from-falcons-red to-yellow-400 rounded-full mix-blend-overlay blur-3xl opacity-40 animate-pulse-fast"></div>
                <div className="absolute bottom-1/4 right-1/4 w-60 md:w-96 h-60 md:h-96 bg-gradient-to-r from-gray-800 to-black rounded-full mix-blend-overlay blur-3xl opacity-40 animate-pulse-slow"></div>
            </div>
        </div>
    );
}

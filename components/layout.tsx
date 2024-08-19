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
            <header className="bg-gradient-to-r from-black via-gray-900 to-falcons-red bg-opacity-90 py-6 fixed top-0 w-full z-30 shadow-xl backdrop-filter backdrop-blur-lg border-b border-gray-700">
                <div className="container mx-auto flex justify-between items-center px-4 md:px-6">
                    {/* Animated Logo */}
                    <div className="text-4xl md:text-5xl font-extrabold text-falcons-red tracking-tight uppercase leading-tight drop-shadow-lg transition-all duration-300 hover:scale-105">
                        <Link href="/">
                            <span className="cursor-pointer">Fred&#39;s Picks</span>
                        </Link>
                    </div>

                    {/* Navigation Menu */}
                    <nav>
                        <ul className="flex space-x-6 md:space-x-12 items-center">
                            <li>
                                <Link href="/" passHref>
                                    <span className="relative text-white uppercase font-bold text-lg tracking-wide cursor-pointer transition-all duration-300 hover:text-yellow-400 before:absolute before:-bottom-2 before:left-0 before:w-full before:h-1 before:bg-yellow-400 before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100">
                                        Dashboard
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/bets" passHref>
                                    <span className="relative text-white uppercase font-bold text-lg tracking-wide cursor-pointer transition-all duration-300 hover:text-yellow-400 before:absolute before:-bottom-2 before:left-0 before:w-full before:h-1 before:bg-yellow-400 before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100">
                                        Manage Bets
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className={`container mx-auto py-28 transform transition-all duration-1000 ${animated ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                {children}
            </main>

            {/* Background Animations */}
            <div className="absolute top-0 left-0 w-full h-full z-[-1]">
                <div className="absolute top-1/4 left-1/4 w-64 md:w-80 h-64 md:h-80 bg-gradient-to-r from-falcons-red to-yellow-400 rounded-full mix-blend-overlay blur-3xl opacity-40 animate-pulse-fast"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 md:w-96 h-80 md:h-96 bg-gradient-to-r from-gray-800 to-black rounded-full mix-blend-overlay blur-3xl opacity-40 animate-pulse-slow"></div>
            </div>
        </div>
    );
}

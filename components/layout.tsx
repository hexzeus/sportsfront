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
            <header className="bg-gradient-to-r from-black via-gray-900 to-falcons-red bg-opacity-90 py-6 fixed top-0 w-full z-30 shadow-lg backdrop-filter backdrop-blur-lg border-b border-gray-700">
                <div className="container mx-auto flex justify-between items-center px-6">
                    {/* Animated Logo */}
                    <div className="text-4xl font-extrabold text-falcons-red tracking-wider uppercase animate-pulse">
                        <Link href="/">
                            <span className="cursor-pointer">Sports Mania</span>
                        </Link>
                    </div>

                    {/* Navigation Menu */}
                    <nav>
                        <ul className="flex space-x-10">
                            <li>
                                <Link href="/" passHref>
                                    <span className="relative text-white uppercase font-bold text-lg tracking-wide cursor-pointer transition-all duration-300 hover:text-falcons-silver before:absolute before:-bottom-2 before:left-0 before:w-full before:h-1 before:bg-falcons-red before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100">
                                        Home
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/bets" passHref>
                                    <span className="relative text-white uppercase font-bold text-lg tracking-wide cursor-pointer transition-all duration-300 hover:text-falcons-silver before:absolute before:-bottom-2 before:left-0 before:w-full before:h-1 before:bg-falcons-red before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100">
                                        Bets
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

            {/* Background animations */}
            <div className="absolute top-0 left-0 w-full h-full z-[-1]">
                <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-falcons-red rounded-full mix-blend-overlay blur-2xl opacity-30 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-500 rounded-full mix-blend-overlay blur-2xl opacity-30 animate-pulse-slow"></div>
            </div>
        </div>
    );
}

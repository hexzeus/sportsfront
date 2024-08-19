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
            <header className="bg-falcons-black bg-opacity-80 py-6 fixed top-0 w-full z-20 shadow-lg">
                <nav>
                    <ul className="flex space-x-8 justify-center text-2xl font-bold tracking-wide">
                        <li>
                            <Link href="/" passHref>
                                <span className="text-white hover:text-falcons-silver transition-colors duration-300 cursor-pointer uppercase">
                                    Home
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/bets" passHref>
                                <span className="text-white hover:text-falcons-silver transition-colors duration-300 cursor-pointer uppercase">
                                    Bets
                                </span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </header>

            {/* Main Content */}
            <main className={`container mx-auto py-20 transform transition-all duration-1000 ${animated ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                {children}
            </main>

            {/* Background animations */}
            <div className="absolute top-0 left-0 w-full h-full z-[-1]">
                <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-falcons-red rounded-full mix-blend-overlay blur-2xl opacity-30 animate-pulse-fast"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-500 rounded-full mix-blend-overlay blur-2xl opacity-30 animate-pulse-slow"></div>
            </div>
        </div>
    );
}

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        setAnimated(true); // Trigger entrance animation for all pages
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-r from-black via-red-900 to-gray-900 text-white flex flex-col relative overflow-hidden">
            {/* Navigation */}
            <header className="bg-transparent p-4 absolute top-0 w-full z-10">
                <nav>
                    <ul className="flex space-x-4 justify-center text-xl">
                        <li>
                            <Link href="/" passHref>
                                <span className="text-white hover:text-red-500 transition-colors duration-300 cursor-pointer">
                                    Home
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/bets" passHref>
                                <span className="text-white hover:text-red-500 transition-colors duration-300 cursor-pointer">
                                    Bets
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/admin" passHref>
                                <span className="text-white hover:text-red-500 transition-colors duration-300 cursor-pointer">
                                    Admin
                                </span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </header>

            {/* Main Content */}
            <main className={`container mx-auto p-8 transform transition-all duration-700 ${animated ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                {children}
            </main>

            {/* Background animations */}
            <div className="absolute top-0 left-0 w-full h-full z-[-1]">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500 rounded-full mix-blend-overlay blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-500 rounded-full mix-blend-overlay blur-3xl opacity-30 animate-pulse"></div>
            </div>
        </div>
    );
}

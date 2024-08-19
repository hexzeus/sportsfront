import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Layout({ children }: { children: React.ReactNode }) {
    const [animated, setAnimated] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);

    useEffect(() => {
        setAnimated(true); // Trigger entrance animation for all pages

        const handleScroll = () => {
            const currentScrollPosition = window.scrollY;

            // Only hide the navbar when the user scrolls down and they are not at the top of the page
            if (currentScrollPosition > 50 && currentScrollPosition > scrollPosition) {
                setIsNavbarVisible(false);
            } else {
                setIsNavbarVisible(true);
            }
            setScrollPosition(currentScrollPosition);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrollPosition]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-falcons-black text-white flex flex-col relative overflow-hidden">
            {/* Navigation */}
            <header
                className={`bg-gradient-to-r from-black via-gray-900 to-falcons-red bg-opacity-95 py-4 md:py-6 fixed top-0 w-full z-40 shadow-xl backdrop-filter backdrop-blur-lg border-b border-gray-700 transition-transform duration-500 ${isNavbarVisible ? 'translate-y-0' : '-translate-y-full'}`}
            >
                <div className="container mx-auto flex justify-between items-center px-4 md:px-6">
                    {/* Logo and Title */}
                    <div className="flex items-center space-x-3 md:space-x-5">
                        {/* Falcons Logo */}
                        <div className="w-10 md:w-14 h-10 md:h-14 relative">
                            <Image
                                src="/falcon-logo.png"
                                alt="Falcons Logo"
                                layout="fill"
                                objectFit="contain"
                                priority
                            />
                        </div>
                        {/* Title */}
                        <div className="text-2xl md:text-4xl font-extrabold text-falcons-red tracking-tight uppercase leading-tight drop-shadow-lg transition-all duration-300 hover:scale-110">
                            <Link href="/">
                                <span className="cursor-pointer hover:text-falcons-silver">Freds Sports</span>
                            </Link>
                        </div>
                    </div>

                    {/* Responsive Navigation Menu */}
                    <nav>
                        <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-8 items-center">
                            <li>
                                <Link href="/" passHref>
                                    <span className="relative text-white uppercase font-bold text-lg md:text-xl tracking-wide cursor-pointer transition-all duration-300 hover:text-falcons-silver before:absolute before:-bottom-1 before:left-0 before:w-full before:h-0.5 before:bg-falcons-silver before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100">
                                        Home
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/bets" passHref>
                                    <span className="relative text-white uppercase font-bold text-lg md:text-xl tracking-wide cursor-pointer transition-all duration-300 hover:text-falcons-silver before:absolute before:-bottom-1 before:left-0 before:w-full before:h-0.5 before:bg-falcons-silver before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100">
                                        Bets
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className={`container mx-auto pt-24 md:pt-32 px-4 md:px-0 transform transition-all duration-1000 ${animated ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                {children}
            </main>

            {/* Background Animations */}
            <div className="absolute top-0 left-0 w-full h-full z-[-1]">
                <div className="absolute top-1/4 left-1/3 w-48 md:w-80 h-48 md:h-80 bg-gradient-to-r from-falcons-red to-yellow-400 rounded-full mix-blend-overlay blur-3xl opacity-50 animate-pulse-fast"></div>
                <div className="absolute bottom-1/4 right-1/3 w-60 md:w-96 h-60 md:h-96 bg-gradient-to-r from-gray-800 to-black rounded-full mix-blend-overlay blur-3xl opacity-50 animate-pulse-slow"></div>
            </div>
        </div>
    );
}

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FiMenu, FiX } from 'react-icons/fi';
import { Lock, Hammer } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
    const [animated, setAnimated] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setAnimated(true);

        const handleScroll = () => {
            const currentScrollPosition = window.scrollY;
            if (currentScrollPosition > 50 && currentScrollPosition > scrollPosition) {
                setIsNavbarVisible(false);
            } else {
                setIsNavbarVisible(true);
            }
            setScrollPosition(currentScrollPosition);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrollPosition]);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white flex flex-col relative overflow-hidden">
            <header
                className={`bg-gradient-to-r from-black via-gray-900 to-blue-900 bg-opacity-95 py-3 md:py-4 fixed top-0 w-full z-40 shadow-xl backdrop-filter backdrop-blur-lg border-b border-blue-800 transition-transform duration-300 ${isNavbarVisible ? 'translate-y-0' : '-translate-y-full'}`}
            >
                <div className="container mx-auto flex justify-between items-center px-4 md:px-6">
                    <div className="flex items-center space-x-2 md:space-x-3">
                        <div className="w-8 md:w-10 h-8 md:h-10 relative">
                            <Image
                                src="/file.png"
                                alt="Lock and Hammer Picks Logo"
                                fill
                                sizes="(max-width: 768px) 32px, 40px"
                                style={{ objectFit: 'contain' }}
                                priority
                            />
                        </div>
                        <div className="flex items-center text-sm md:text-xl font-extrabold text-blue-500 tracking-tight uppercase leading-tight drop-shadow-lg transition-all duration-300 hover:scale-105">
                            <Link href="/" className="cursor-pointer hover:text-blue-400 flex items-center" onClick={closeMobileMenu}>
                                <Lock className="w-4 h-4 md:w-6 md:h-6 mr-1" />
                                <span className="mr-1">&</span>
                                <Hammer className="w-4 h-4 md:w-6 md:h-6 mr-1" />
                                <span>Picks</span>
                            </Link>
                        </div>
                    </div>

                    <nav className="hidden md:flex space-x-6 items-center">
                        {['Home', 'Bets', 'Scores'].map((page) => (
                            <Link key={page} href={page === 'Home' ? '/' : `/${page.toLowerCase()}`} className="relative text-white uppercase font-bold text-base tracking-wide cursor-pointer transition-all duration-300 hover:text-blue-400 before:absolute before:-bottom-1 before:left-0 before:w-full before:h-0.5 before:bg-blue-500 before:scale-x-0 before:origin-left before:transition-transform before:duration-300 hover:before:scale-x-100">
                                {page}
                            </Link>
                        ))}
                    </nav>

                    <button className="md:hidden text-2xl text-white" onClick={toggleMobileMenu} aria-label="Toggle Mobile Menu">
                        {isMobileMenuOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>

                {isMobileMenuOpen && (
                    <nav className="md:hidden bg-black bg-opacity-95 absolute top-14 left-0 w-full z-30 py-4 shadow-lg">
                        <ul className="flex flex-col items-center space-y-4">
                            {['Home', 'Picks', 'Scores'].map((page) => (
                                <li key={page}>
                                    <Link href={page === 'Home' ? '/' : `/${page.toLowerCase()}`} className="text-lg text-white uppercase font-bold tracking-wide cursor-pointer transition-all duration-300 hover:text-blue-400" onClick={closeMobileMenu}>
                                        {page}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}
            </header>

            <main className={`container mx-auto pt-20 md:pt-24 px-4 md:px-6 transform transition-all duration-1000 ${animated ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                {children}
            </main>

            <div className="absolute top-0 left-0 w-full h-full z-[-1] opacity-30">
                <div className="absolute top-1/4 left-1/3 w-40 md:w-64 h-40 md:h-64 bg-gradient-to-r from-blue-800 to-blue-600 rounded-full mix-blend-overlay blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 right-1/3 w-48 md:w-80 h-48 md:h-80 bg-gradient-to-r from-gray-800 to-black rounded-full mix-blend-overlay blur-3xl animate-pulse-fast"></div>
            </div>
        </div>
    );
}

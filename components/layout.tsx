import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Skull, Flame, Zap, Menu, X, Home, BarChart2, Award, Settings } from 'lucide-react';

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

    const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const navItems = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Bets', href: '/bets', icon: BarChart2 },
        { name: 'Scores', href: '/scores', icon: Award },
        { name: 'Admin', href: '/admin', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col relative overflow-hidden">
            {/* Badass Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-800"></div>
                <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                    <filter id="noise">
                        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                        <feColorMatrix type="saturate" values="0" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noise)" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 via-transparent to-orange-700/20"></div>
            </div>

            {/* Slick Navbar */}
            <header
                className={`fixed top-0 w-full z-50 transition-all duration-300 ease-in-out ${isNavbarVisible ? 'translate-y-0' : '-translate-y-full'
                    }`}
            >
                <div className="bg-zinc-900 bg-opacity-80 backdrop-filter backdrop-blur-lg border-b border-zinc-800">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <Link href="/" className="flex-shrink-0 flex items-center space-x-2">
                                <div className="w-10 h-10 relative">
                                    <Image
                                        src="/file.png"
                                        alt="Lock and Hammer Picks Logo"
                                        fill
                                        sizes="40px"
                                        style={{ objectFit: 'contain' }}
                                        priority
                                    />
                                </div>
                                <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500" style={{ fontFamily: 'Impact, sans-serif' }}>
                                    L&H PICKS
                                </span>
                            </Link>

                            {/* Desktop Navigation */}
                            <nav className="hidden md:flex space-x-8">
                                {navItems.map((item) => (
                                    <Link key={item.name} href={item.href} className="flex items-center space-x-2 text-zinc-300 hover:text-orange-500 transition-colors duration-200 ease-in-out group">
                                        <item.icon className="w-5 h-5 group-hover:text-yellow-500 transition-colors duration-200 ease-in-out" />
                                        <span className="font-bold tracking-wide group-hover:tracking-wider transition-all duration-200 ease-in-out">
                                            {item.name.toUpperCase()}
                                        </span>
                                    </Link>
                                ))}
                            </nav>

                            {/* Mobile menu button */}
                            <div className="md:hidden">
                                <button
                                    onClick={toggleMobileMenu}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                >
                                    <span className="sr-only">Open main menu</span>
                                    {isMobileMenuOpen ? (
                                        <X className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <Menu className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className={`md:hidden transition-max-height duration-500 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-screen' : 'max-h-0'}`}>
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center space-x-3 text-zinc-300 hover:bg-zinc-700 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                                    onClick={closeMobileMenu}
                                >
                                    <item.icon className="w-5 h-5 flex-shrink-0" />
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className={`flex-grow pt-16 transition-all duration-1000 ${animated ? 'opacity-100' : 'opacity-0'}`}>
                {children}
            </main>

            {/* Dynamic Background Elements */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-red-900 to-orange-800 rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 bg-gradient-to-r from-yellow-900 to-red-800 rounded-full blur-3xl opacity-20 animate-pulse-fast"></div>
            </div>

            {/* Footer Icons */}
            <div className="fixed bottom-4 right-4 flex space-x-2">
                <Skull className="w-6 h-6 text-zinc-500 animate-pulse" />
                <Flame className="w-6 h-6 text-orange-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
                <Zap className="w-6 h-6 text-yellow-500 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
        </div>
    );
}

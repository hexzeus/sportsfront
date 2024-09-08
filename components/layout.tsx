import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { Home, BarChart2, Settings, Menu, X, Lock, Hammer, Trophy, TrendingUp } from 'lucide-react';

const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Live Scores', href: '/scores', icon: TrendingUp },
    { name: 'Bets', href: '/bets', icon: BarChart2 },
    { name: 'Admin', href: '/admin', icon: Settings },
];

export default function Layout({ children }: { children: React.ReactNode }) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();

    const handleScroll = useCallback(() => {
        setIsScrolled(window.scrollY > 10);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    // Close mobile menu on route change
    useEffect(() => {
        const handleRouteChange = () => setIsMobileMenuOpen(false);
        router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router.events]);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    // Navbar Container with Opacity Changes
    const NavbarContainer = ({ children }: { children: React.ReactNode }) => (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed w-full z-50 transition-all duration-500 ${isScrolled
                ? 'bg-gradient-to-r from-zinc-900/80 via-dark-blue/80 to-zinc-800/80 backdrop-blur-md shadow-xl'
                : 'bg-transparent'
                }`}
        >
            {children}
        </motion.nav>
    );

    // Updated NavItem with Spacing and Opacity
    const NavItem = ({ item, mobile = false }: { item: typeof navItems[0]; mobile?: boolean }) => {
        const isActive = router.pathname === item.href;

        return (
            <Link href={item.href} passHref legacyBehavior>
                <motion.a
                    className={`flex items-center space-x-4 px-5 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${isActive
                        ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gradient-to-r hover:from-red-600/10 hover:to-orange-500/10 hover:text-white opacity-80 hover:opacity-100'
                        } ${mobile ? 'w-full' : ''}`}
                    whileHover={{ scale: 1.1, opacity: 1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => mobile && setIsMobileMenuOpen(false)}
                >
                    <item.icon className="w-5 h-5" />
                    <span className="uppercase tracking-wider">{item.name}</span>
                </motion.a>
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-dark-blue to-zinc-800 text-gray-200">
            {/* Texture Overlay */}
            <div className="fixed inset-0 z-0 opacity-5 pointer-events-none">
                <Image src="/subtle-texture.png" alt="Texture" layout="fill" objectFit="cover" />
            </div>

            {/* Navbar */}
            <NavbarContainer>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center">
                            <Link href="/" passHref legacyBehavior>
                                <motion.a
                                    className="flex-shrink-0 flex items-center space-x-2"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="relative w-12 h-12">
                                        <Image
                                            src="/file.png"
                                            alt="L&H Picks Logo"
                                            fill
                                            className="rounded-full"
                                            style={{ objectFit: 'contain' }}
                                        />
                                    </div>
                                    <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-yellow-500 to-orange-500">
                                        L&H PICKS
                                    </span>
                                </motion.a>
                            </Link>
                        </div>
                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navItems.map((item) => (
                                <NavItem key={item.name} item={item} />
                            ))}
                        </div>
                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <motion.button
                                onClick={toggleMobileMenu}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-red-600/20 hover:to-orange-500/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-300"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </NavbarContainer>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="md:hidden fixed inset-x-0 top-20 z-40 bg-gradient-to-b from-zinc-900/95 to-dark-blue/95 backdrop-blur-md overflow-hidden border-t border-gray-700"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {navItems.map((item) => (
                                <NavItem key={item.name} item={item} mobile />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main content */}
            <main className="pt-20 flex-grow">{children}</main>

            {/* Fixed Bottom Icons */}
            <motion.div
                className="fixed bottom-4 right-4 flex space-x-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            >
                {[Lock, Hammer, Trophy].map((Icon, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.2 }} // Removed rotate for a more subtle, professional feel
                        whileTap={{ scale: 0.8 }}
                        className="p-2 bg-gradient-to-br from-zinc-800/80 to-dark-blue/80 rounded-full shadow-lg backdrop-blur-sm animate-pulse"
                        style={{ animationDelay: `${index * 150}ms` }} // Same delay as the other icons
                    ><Icon
                            className={`w-6 h-6 ${index === 0 ? 'text-yellow-500'  // Yellow for DOMINATE
                                    : index === 1 ? 'text-red-500'   // Red for CRUSH
                                        : 'text-gray-300'                // Gray for CONQUER
                                }`}
                        />

                    </motion.div>
                ))}
            </motion.div>

        </div>
    );
}

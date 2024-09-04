import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { Home, BarChart2, Settings, Menu, X, Flame, Zap, TrendingUp, Skull } from 'lucide-react';

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

    // Handles scrolling effect to add background when scrolled
    const handleScroll = useCallback(() => {
        setIsScrolled(window.scrollY > 10);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    // Check if user has visited the intro page before
    useEffect(() => {
        const hasVisitedIntro = localStorage.getItem('visitedIntro');
        if (!hasVisitedIntro && router.pathname !== '/intro') {
            router.push('/intro'); // Redirect to the intro page if not visited before
        }
    }, [router]);

    const NavbarContainer = ({ children }: { children: React.ReactNode }) => (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-zinc-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}
        >
            {children}
        </motion.nav>
    );

    const NavItem = ({ item, mobile = false }: { item: typeof navItems[0]; mobile?: boolean }) => {
        const isActive = router.pathname === item.href;
        return (
            <Link href={item.href} passHref legacyBehavior>
                <motion.a
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${isActive
                        ? 'bg-orange-600 text-white'
                        : 'text-gray-300 hover:bg-orange-600/20 hover:text-white'
                        } ${mobile ? 'w-full' : ''}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                </motion.a>
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-800 text-white">
            {/* Navbar */}
            <NavbarContainer>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" passHref legacyBehavior>
                                <motion.a
                                    className="flex-shrink-0 flex items-center space-x-2"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
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
                                </motion.a>
                            </Link>
                        </div>
                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-4">
                            {navItems.map((item) => (
                                <NavItem key={item.name} item={item} />
                            ))}
                        </div>
                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <motion.button
                                onClick={toggleMobileMenu}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
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
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="md:hidden fixed inset-0 z-40 bg-zinc-900/95 backdrop-blur-md"
                    >
                        <div className="pt-20 pb-3 space-y-1 px-4">
                            {navItems.map((item) => (
                                <NavItem key={item.name} item={item} mobile />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main content */}
            <main className="pt-16 flex-grow">{children}</main>

            {/* Fixed Bottom Icons */}
            <motion.div
                className="fixed bottom-4 right-4 flex space-x-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                {[Skull, Flame, Zap].map((Icon, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                        className="p-2 bg-zinc-800 rounded-full shadow-lg animate-pulse"
                        style={{ animationDelay: `${index * 150}ms` }}
                    >
                        <Icon className={`w-6 h-6 ${index === 0 ? 'text-red-500' : index === 1 ? 'text-orange-500' : 'text-yellow-500'}`} />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}

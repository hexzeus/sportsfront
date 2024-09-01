import React, { useEffect, useState } from 'react';
import { fetchBets } from '../../lib/api';
import { Bet } from '../../lib/types';
import Link from 'next/link';
import Layout from '../../components/layout';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, DollarSign, Award, Zap, Share2, TrendingUp, AlertTriangle } from 'lucide-react';
import {
    FacebookShareButton,
    TwitterShareButton,
    RedditShareButton,
    FacebookIcon,
    TwitterIcon,
    RedditIcon,
} from 'react-share';

export default function BetsPage() {
    const [bets, setBets] = useState<Bet[]>([]);
    const [filteredBets, setFilteredBets] = useState<Bet[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    useEffect(() => {
        async function loadBets() {
            try {
                setLoading(true);
                const data = await fetchBets();
                setBets(data);
                setFilteredBets(data);
            } catch (error) {
                setError('Failed to load bets. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        loadBets();
    }, []);

    useEffect(() => {
        let sorted = [...bets].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        if (sortOrder === 'asc') {
            sorted.reverse();
        }

        const filtered = filter === 'all'
            ? sorted
            : sorted.filter(bet => bet.result === filter);

        setFilteredBets(filtered);
    }, [filter, bets, sortOrder]);

    const isValidUrl = (urlString: string | undefined) => {
        if (!urlString) return false;
        try {
            return Boolean(new URL(urlString));
        } catch (e) {
            return false;
        }
    };

    const toggleSortOrder = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-red-900 text-zinc-100 p-4 sm:p-6 md:p-8 relative overflow-hidden">
                {/* Enhanced Background Elements */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-orange-900/20"></div>
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.png')] opacity-5"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="container mx-auto relative z-10"
                >
                    <motion.h1
                        className="relative text-4xl sm:text-5xl md:text-6xl font-extrabold text-center text-transparent uppercase mb-6 sm:mb-10 md:mb-14"
                        style={{ fontFamily: 'Impact, sans-serif' }}
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <span
                            className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_5px_10px_rgba(255,99,71,0.75)]"
                            style={{
                                animation: 'glitch 2s infinite',
                                WebkitTextStroke: '1px rgba(0,0,0,0.9)',
                            }}
                        >
                            Active Picks
                        </span>
                        <span
                            className="relative z-10 text-4xl sm:text-5xl md:text-6xl bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500"
                            style={{
                                backgroundPosition: '200% center',
                                backgroundSize: '400%',
                                animation: 'gradientMove 5s ease infinite',
                                WebkitTextStroke: '1px rgba(0,0,0,0.9)',
                            }}
                        >
                            Active Picks
                        </span>
                    </motion.h1>

                    <style jsx>{`
    @keyframes gradientMove {
        0% {
            background-position: 0% center;
        }
        100% {
            background-position: 200% center;
        }
    }

    @keyframes glitch {
        0% {
            text-shadow: 2px 2px 0 #ff0000, -2px -2px 0 #00ff00;
        }
        10% {
            text-shadow: -2px -2px 0 #ff0000, 2px 2px 0 #00ff00;
        }
        20% {
            text-shadow: 2px -2px 0 #ff0000, -2px 2px 0 #00ff00;
        }
        30% {
            text-shadow: -2px 2px 0 #ff0000, 2px -2px 0 #00ff00;
        }
        40% {
            text-shadow: 2px 2px 0 #ff0000, -2px -2px 0 #00ff00;
        }
        50% {
            text-shadow: -2px -2px 0 #ff0000, 2px 2px 0 #00ff00;
        }
        60% {
            text-shadow: 2px -2px 0 #ff0000, -2px 2px 0 #00ff00;
        }
        70% {
            text-shadow: -2px 2px 0 #ff0000, 2px -2px 0 #00ff00;
        }
        80% {
            text-shadow: 2px 2px 0 #ff0000, -2px -2px 0 #00ff00;
        }
        90% {
            text-shadow: -2px -2px 0 #ff0000, 2px 2px 0 #00ff00;
        }
        100% {
            text-shadow: 2px -2px 0 #ff0000, -2px 2px 0 #00ff00;
        }
    }
`}</style>

                    {/* Filter and Sort Controls */}
                    <motion.div
                        className="flex flex-col sm:flex-row justify-center items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0 sm:space-x-4 relative z-20"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <div className="bg-zinc-800 p-1 rounded-full flex space-x-2 z-30">
                            {['all', 'win', 'loss', 'pending'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-full transition-all duration-300 ${filter === f
                                        ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white'
                                        : 'text-zinc-300 hover:text-white'
                                        }`}
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={toggleSortOrder}
                            className="flex items-center space-x-2 px-4 py-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-all duration-300 z-30"
                        >
                            <TrendingUp size={18} />
                            <span>{sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}</span>
                        </button>
                    </motion.div>

                    {loading && (
                        <motion.div
                            className="flex justify-center items-center h-64"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="w-24 h-24 border-t-4 border-b-4 border-red-600 rounded-full animate-spin"></div>
                        </motion.div>
                    )}
                    {error && (
                        <motion.p
                            className="text-red-500 text-center mb-6 text-lg sm:text-xl flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <AlertTriangle className="mr-2" size={24} />
                            {error}
                        </motion.p>
                    )}
                    {!loading && filteredBets.length === 0 && !error && (
                        <motion.p
                            className="text-center text-zinc-400 text-xl sm:text-2xl"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            No active bets. Time to make your power play!
                        </motion.p>
                    )}

                    <AnimatePresence>
                        <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 relative z-20"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: { transition: { staggerChildren: 0.1 } }
                            }}
                        >
                            {filteredBets.map((bet) => (
                                <motion.div
                                    key={bet.id}
                                    id={`bet-${bet.id}`}
                                    className="bg-gradient-to-br from-zinc-900 to-black rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 border border-red-700 hover:border-orange-500"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    whileHover={{ scale: 1.03, boxShadow: "0 0 15px rgba(255, 99, 71, 0.3)" }}
                                    whileTap={{ scale: 0.97 }}
                                    layout
                                >
                                    <div className="p-4 relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-orange-900/10 to-yellow-900/10 pointer-events-none"></div>
                                        {isValidUrl(bet.description) ? (
                                            <div className="flex flex-col items-center relative z-10">
                                                <Image
                                                    src={bet.description || '/default-image.jpg'}
                                                    alt="Bet Image"
                                                    width={280}
                                                    height={180}
                                                    className="rounded-lg shadow-lg object-cover"
                                                />
                                                <p className="text-zinc-100 mt-4 text-lg sm:text-xl font-bold">
                                                    Result:
                                                    <span className={`ml-2 px-2 py-1 rounded ${bet.result === 'win' ? 'bg-green-600' :
                                                        bet.result === 'loss' ? 'bg-red-600' : 'bg-zinc-600'
                                                        } text-zinc-100`}>
                                                        {bet.result?.toUpperCase()}
                                                    </span>
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="relative z-10">
                                                <div className="text-center mb-4">
                                                    <p className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 mb-2 uppercase">
                                                        {bet.team}
                                                    </p>
                                                    <p className="text-lg sm:text-xl text-zinc-300">vs {bet.opponent}</p>
                                                    <p className="text-sm sm:text-md text-zinc-400">
                                                        {new Date(bet.date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="space-y-2 sm:space-y-3 text-md sm:text-lg">
                                                    <p className="text-zinc-100 flex items-center justify-between">
                                                        <span className="font-semibold flex items-center"><DollarSign className="mr-2 text-green-500" /> Bet Amount:</span>
                                                        <span className="text-green-400">${Number(bet.amount).toFixed(2)}</span>
                                                    </p>
                                                    <p className="text-zinc-100 flex items-center justify-between">
                                                        <span className="font-semibold flex items-center"><Zap className="mr-2 text-yellow-500" /> Odds:</span>
                                                        <span>{bet.odds}</span>
                                                    </p>
                                                    <p className="text-zinc-100 flex items-center justify-between">
                                                        <span className="font-semibold">Bet Type:</span>
                                                        <span>{bet.betType}</span>
                                                    </p>
                                                    <p className="text-zinc-100 flex items-center justify-between">
                                                        <span className="font-semibold">Ticket Cost:</span>
                                                        <span>${Number(bet.ticketCost || 0).toFixed(2)}</span>
                                                    </p>
                                                    <p className="text-zinc-100 flex items-center justify-between">
                                                        <span className="font-semibold flex items-center"><Award className="mr-2 text-yellow-400" /> Potential Payout:</span>
                                                        <span className="text-yellow-400 font-bold">${Number(bet.payout || 0).toFixed(2)}</span>
                                                    </p>
                                                    <p className="text-zinc-100 flex items-center justify-between">
                                                        <span className="font-semibold">Result:</span>
                                                        <span className={`px-2 py-1 rounded ${bet.result === 'win' ? 'bg-green-600' :
                                                            bet.result === 'loss' ? 'bg-red-600' : 'bg-zinc-600'
                                                            } text-zinc-100`}>
                                                            {bet.result?.toUpperCase()}
                                                        </span>
                                                    </p>
                                                </div>
                                                {bet.description && !isValidUrl(bet.description) && (
                                                    <div className="mt-4 text-zinc-300 italic text-center">
                                                        &quot;{bet.description}&quot;
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-black bg-opacity-50 p-4 flex justify-center space-x-4 items-center border-t border-red-700">
                                        <Share2 className="text-red-500 mr-2" />
                                        <FacebookShareButton url={`${typeof window !== 'undefined' ? window.location.href : ''}#bet-${bet.id}`} hashtag="#SportsBet">
                                            <FacebookIcon size={32} round />
                                        </FacebookShareButton>
                                        <TwitterShareButton url={`${typeof window !== 'undefined' ? window.location.href : ''}#bet-${bet.id}`} title={`Bet on ${bet.team} vs ${bet.opponent}!`}>
                                            <TwitterIcon size={32} round />
                                        </TwitterShareButton>
                                        <RedditShareButton url={`${typeof window !== 'undefined' ? window.location.href : ''}#bet-${bet.id}`} title={`Check out this bet on ${bet.team} vs ${bet.opponent}!`}>
                                            <RedditIcon size={32} round />
                                        </RedditShareButton>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>

                    <div className="mt-10 sm:mt-14 md:mt-16 text-center">
                        <Link href="/">
                            <motion.span
                                className="inline-block bg-gradient-to-r from-red-600 to-orange-600 text-zinc-100 text-md sm:text-lg font-extrabold uppercase py-3 px-8 rounded-full shadow-2xl hover:from-red-700 hover:to-orange-700 transition-all duration-300 ease-out transform-gpu"
                                whileHover={{ scale: 1.1, rotate: 2 }}
                                whileTap={{ scale: 0.95, rotate: -2 }}
                            >
                                <Flame className="inline-block mr-2" />
                                Back to Home
                            </motion.span>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
}

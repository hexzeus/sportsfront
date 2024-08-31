import { useEffect, useState } from 'react';
import { fetchBets } from '../../lib/api';
import { Bet } from '../../lib/types';
import Link from 'next/link';
import Layout from '../../components/layout';
import Image from 'next/image'; // Import the Next.js Image component
import { motion } from 'framer-motion';
import { FaDollarSign, FaTrophy, FaBolt } from 'react-icons/fa';
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
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadBets() {
            try {
                const data = await fetchBets();
                setBets(data);
            } catch (error) {
                setError('Failed to load bets.');
            } finally {
                setLoading(false);
            }
        }

        loadBets();
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hash = window.location.hash;
            if (hash) {
                const element = document.getElementById(hash.substring(1));
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    }, [bets]);

    const isValidUrl = (urlString: string | undefined) => {
        if (!urlString) return false;
        try {
            return Boolean(new URL(urlString));
        } catch (e) {
            return false;
        }
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 p-4 sm:p-6 md:p-8 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="container mx-auto"
                >
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-gray-300 to-red-600 uppercase mb-8 sm:mb-12 md:mb-16 drop-shadow-2xl">
                        Active Picks
                    </h1>

                    {loading && (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"></div>
                        </div>
                    )}
                    {error && <p className="text-red-500 text-center mb-6 text-xl">{error}</p>}
                    {!loading && bets.length === 0 && !error && (
                        <p className="text-center text-gray-400 text-2xl">No active bets. Time to make your power play!</p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
                        {bets.map((bet) => (
                            <motion.div
                                key={bet.id}
                                id={`bet-${bet.id}`}
                                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-red-900/50"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="p-6">
                                    {isValidUrl(bet.description) ? (
                                        <div className="flex flex-col items-center">
                                            <Image
                                                src={bet.description || '/default-image.jpg'}
                                                alt="Bet Image"
                                                width={300}
                                                height={200}
                                                className="rounded-lg shadow-lg object-cover"
                                            />
                                            <p className="text-white mt-4 text-xl font-bold">
                                                Result:
                                                <span className={`ml-2 px-3 py-1 rounded ${bet.result === 'win' ? 'bg-green-600' :
                                                    bet.result === 'loss' ? 'bg-red-600' : 'bg-gray-600'
                                                    } text-white`}>
                                                    {bet.result?.toUpperCase()}
                                                </span>
                                            </p>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="text-center mb-4">
                                                <p className="text-3xl sm:text-4xl font-extrabold text-red-500 mb-2 uppercase">
                                                    {bet.team}
                                                </p>
                                                <p className="text-xl text-gray-300">vs {bet.opponent}</p>
                                                <p className="text-md text-gray-400">
                                                    {new Date(bet.date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="space-y-3 text-lg">
                                                <p className="text-white flex items-center justify-between">
                                                    <span className="font-semibold flex items-center"><FaDollarSign className="mr-2 text-red-500" /> Bet Amount:</span>
                                                    <span className="text-green-400">${Number(bet.amount).toFixed(2)}</span>
                                                </p>
                                                <p className="text-white flex items-center justify-between">
                                                    <span className="font-semibold flex items-center"><FaBolt className="mr-2 text-yellow-500" /> Odds:</span>
                                                    <span>{bet.odds}</span>
                                                </p>
                                                <p className="text-white flex items-center justify-between">
                                                    <span className="font-semibold">Bet Type:</span>
                                                    <span>{bet.betType}</span>
                                                </p>
                                                <p className="text-white flex items-center justify-between">
                                                    <span className="font-semibold">Ticket Cost:</span>
                                                    <span>${Number(bet.ticketCost || 0).toFixed(2)}</span>
                                                </p>
                                                <p className="text-white flex items-center justify-between">
                                                    <span className="font-semibold flex items-center"><FaTrophy className="mr-2 text-yellow-400" /> Potential Payout:</span>
                                                    <span className="text-yellow-400 font-bold">${Number(bet.payout || 0).toFixed(2)}</span>
                                                </p>
                                                <p className="text-white flex items-center justify-between">
                                                    <span className="font-semibold">Result:</span>
                                                    <span className={`px-3 py-1 rounded ${bet.result === 'win' ? 'bg-green-600' :
                                                        bet.result === 'loss' ? 'bg-red-600' : 'bg-gray-600'
                                                        } text-white`}>
                                                        {bet.result?.toUpperCase()}
                                                    </span>
                                                </p>
                                            </div>
                                            {bet.description && !isValidUrl(bet.description) && (
                                                <div className="mt-4 text-gray-300 italic text-center">
                                                    &quot;{bet.description}&quot;
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="bg-black p-4 flex justify-center space-x-4">
                                    <FacebookShareButton url={`${typeof window !== 'undefined' ? window.location.href : ''}#bet-${bet.id}`} hashtag="#SportsBet">
                                        <FacebookIcon size={40} round />
                                    </FacebookShareButton>
                                    <TwitterShareButton url={`${typeof window !== 'undefined' ? window.location.href : ''}#bet-${bet.id}`} title={`Bet on ${bet.team} vs ${bet.opponent}!`}>
                                        <TwitterIcon size={40} round />
                                    </TwitterShareButton>
                                    <RedditShareButton url={`${typeof window !== 'undefined' ? window.location.href : ''}#bet-${bet.id}`} title={`Check out this bet on ${bet.team} vs ${bet.opponent}!`}>
                                        <RedditIcon size={40} round />
                                    </RedditShareButton>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12 sm:mt-16 md:mt-20 text-center">
                        <Link href="/">
                            <motion.span
                                className="inline-block bg-gradient-to-r from-red-700 to-red-900 text-white text-xl font-bold py-4 px-8 rounded-lg shadow-xl hover:from-red-600 hover:to-red-800 transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Back to Home
                            </motion.span>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
}

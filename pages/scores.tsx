import { useEffect, useState } from 'react';
import Layout from '../components/layout';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Trophy, Newspaper, Loader, Shirt, Dumbbell, Dribbble, Disc } from 'lucide-react';

interface SportEndpoints {
    scores: string;
    news: string;
}

interface ApiResponse {
    events?: any[];
    articles?: any[];
}

const endpoints: Record<string, SportEndpoints> = {
    nfl: {
        scores: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard',
        news: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/news',
    },
    mlb: {
        scores: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard',
        news: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/news',
    },
    nba: {
        scores: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard',
        news: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/news',
    },
    nhl: {
        scores: 'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard',
        news: 'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/news',
    },
};

const sportIcons = {
    nfl: Shirt,
    mlb: Dumbbell,
    nba: Dribbble,
    nhl: Disc,
};

export default function ScoresPage() {
    const [activeSport, setActiveSport] = useState<keyof typeof endpoints>('nfl');
    const [scores, setScores] = useState<any[]>([]);
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [scoresResponse, newsResponse] = await Promise.all([
                    axios.get<ApiResponse>(endpoints[activeSport].scores),
                    axios.get<ApiResponse>(endpoints[activeSport].news),
                ]);

                setScores(scoresResponse.data.events || []);
                setNews(newsResponse.data.articles || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeSport]);

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-red-900 text-zinc-100 px-4 md:px-6 pt-10 md:pt-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-noise opacity-5"></div>
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-red-800 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 bg-gradient-to-r from-orange-800 to-red-900 rounded-full blur-3xl opacity-30 animate-spin-slow"></div>

                <div className="container mx-auto py-6 md:py-10 relative z-10">
                    <motion.h1
                        className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 uppercase mb-8 tracking-wider"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ fontFamily: 'Impact, sans-serif' }}
                    >
                        Live Sports Scores & News
                    </motion.h1>

                    {/* Sport Selector */}
                    <motion.div
                        className="flex justify-center flex-wrap space-x-2 sm:space-x-4 mb-6 sm:mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        {Object.keys(endpoints).map((sportKey) => {
                            const SportIcon = sportIcons[sportKey as keyof typeof sportIcons];
                            return (
                                <motion.button
                                    key={sportKey}
                                    className={`text-xs sm:text-sm md:text-lg font-bold uppercase tracking-wide px-3 py-2 sm:px-4 sm:py-3 rounded-lg shadow-lg transition-all duration-300 flex items-center ${activeSport === sportKey
                                        ? 'bg-gradient-to-r from-red-600 to-orange-600 text-zinc-100'
                                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                                        }`}
                                    onClick={() => setActiveSport(sportKey as keyof typeof endpoints)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <SportIcon className="mr-2" size={20} />
                                    {sportKey.toUpperCase()}
                                </motion.button>
                            );
                        })}
                    </motion.div>

                    {loading ? (
                        <motion.div
                            className="text-center text-zinc-400 flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Loader className="animate-spin mr-2" size={24} />
                            Loading {activeSport.toUpperCase()} data...
                        </motion.div>
                    ) : (
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            {/* Scores Section */}
                            <motion.div
                                className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 border border-red-700"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <h2 className="text-xl sm:text-2xl font-bold text-orange-500 mb-4 tracking-wide flex items-center">
                                    <Trophy className="mr-2" size={24} />
                                    Latest Scores
                                </h2>
                                <AnimatePresence>
                                    {scores.length > 0 ? (
                                        scores.map((game, index) => (
                                            <motion.div
                                                key={index}
                                                className="mb-4 md:mb-6 border-b border-zinc-700 pb-4"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <p className="text-lg sm:text-xl text-zinc-100 font-semibold tracking-wider">
                                                        {game.shortName}
                                                    </p>
                                                    <p className="text-lg sm:text-xl text-orange-500 font-bold">
                                                        {game.competitions?.[0].competitors?.[0]?.score} - {game.competitions?.[0].competitors?.[1]?.score}
                                                    </p>
                                                </div>
                                                <p className="text-xs sm:text-sm text-zinc-400">
                                                    {new Date(game.date).toLocaleDateString()}
                                                </p>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <p className="text-zinc-400">No scores available</p>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            {/* News Section */}
                            <motion.div
                                className="bg-gradient-to-br from-zinc-900 to-black rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 border border-red-700"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <h2 className="text-xl sm:text-2xl font-bold text-orange-500 mb-4 tracking-wide flex items-center">
                                    <Newspaper className="mr-2" size={24} />
                                    Latest News
                                </h2>
                                <AnimatePresence>
                                    {news.length > 0 ? (
                                        news.map((article, index) => (
                                            <motion.div
                                                key={index}
                                                className="mb-4 md:mb-6 border-b border-zinc-700 pb-4"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                            >
                                                <a
                                                    href={article.links?.web?.href}
                                                    className="text-md sm:text-lg text-orange-500 font-bold hover:underline tracking-wider flex items-center"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Flame className="mr-2" size={18} />
                                                    {article.headline}
                                                </a>
                                                <p className="text-xs sm:text-sm text-zinc-400 mt-2">{article.description}</p>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <p className="text-zinc-400">No news available</p>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </motion.div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

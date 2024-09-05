import { useEffect, useState } from 'react';
import Layout from '../components/layout';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Trophy, Newspaper, Loader, Shirt, Dumbbell, Dribbble, Disc } from 'lucide-react';
import Image from 'next/image'; // Import the Next.js Image component

// API Endpoints and icons for each sport
const endpoints = {
    nfl: {
        scores: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard',
        news: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/news',
        teams: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams',
    },
    mlb: {
        scores: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard',
        news: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/news',
        teams: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams',
    },
    nba: {
        scores: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard',
        news: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/news',
        teams: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams',
    },
    nhl: {
        scores: 'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard',
        news: 'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/news',
        teams: 'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/teams',
    },
    college_football: {
        scores: 'https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard',
        news: 'https://site.api.espn.com/apis/site/v2/sports/football/college-football/news',
        teams: 'https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams',
    },
    college_basketball: {
        scores: 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard',
        news: 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/news',
        teams: 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/teams',
    },
    soccer: {
        scores: 'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard',
        news: 'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/news',
        teams: 'https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/teams',
    },
};

// Icons for each sport
const sportIcons = {
    nfl: Shirt,
    mlb: Dumbbell,
    nba: Dribbble,
    nhl: Disc,
    college_football: Flame,
    college_basketball: Trophy,
    soccer: Disc,
};

export default function ScoresPage() {
    const [activeSport, setActiveSport] = useState<keyof typeof endpoints>('nfl');
    const [scores, setScores] = useState<any[]>([]);
    const [news, setNews] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [scoresResponse, newsResponse, teamsResponse] = await Promise.all([
                    axios.get(endpoints[activeSport].scores),
                    axios.get(endpoints[activeSport].news),
                    axios.get(endpoints[activeSport].teams),
                ]);

                setScores(scoresResponse.data.events || []);
                setNews(newsResponse.data.articles || []);
                setTeams(teamsResponse.data.sports[0].leagues[0].teams.map((t: any) => t.team) || []);
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
            <div className="min-h-screen bg-gradient-to-br from-black via-dark-blue to-slate-900 text-gray-200 px-4 md:px-6 pt-10 md:pt-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-noise opacity-5"></div>
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-electric-blue rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 bg-gradient-to-r from-blue-800 to-slate-900 rounded-full blur-3xl opacity-30 animate-spin-slow"></div>

                <div className="container mx-auto py-6 md:py-10 relative z-10">
                    <motion.h1
                        className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-gray-500 to-gray-200 uppercase mb-6 sm:mb-8 tracking-wider"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ fontFamily: 'Impact, sans-serif' }}
                    >
                        Live Sports Scores & News
                    </motion.h1>

                    {/* Sport Selector */}
                    <motion.div
                        className="flex overflow-x-auto space-x-2 sm:space-x-4 mb-4 sm:mb-6 pb-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        {Object.keys(endpoints).map((sportKey) => {
                            const SportIcon = sportIcons[sportKey as keyof typeof sportIcons];
                            return (
                                <motion.button
                                    key={sportKey}
                                    className={`flex-none text-sm sm:text-lg font-bold uppercase tracking-wide px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow-lg transition-all duration-300 flex items-center whitespace-nowrap ${activeSport === sportKey
                                        ? 'bg-gradient-to-r from-blue-500 to-gray-500 text-gray-100'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                        }`}
                                    onClick={() => setActiveSport(sportKey as keyof typeof endpoints)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <SportIcon className="mr-2" size={18} />
                                    {sportKey.toUpperCase().replace('_', ' ')}
                                </motion.button>
                            );
                        })}
                    </motion.div>

                    {loading ? (
                        <motion.div
                            className="text-center text-gray-400 flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Loader className="animate-spin mr-2" size={24} />
                            Loading {activeSport.toUpperCase()} data...
                        </motion.div>
                    ) : (
                        <motion.div
                            className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            {/* Scores Section */}
                            <motion.div
                                className="bg-gradient-to-br from-slate-900 to-black rounded-xl shadow-lg p-4 sm:p-6 border border-blue-700"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <h2 className="text-xl sm:text-2xl font-bold text-blue-400 mb-3 tracking-wide flex items-center">
                                    <Trophy className="mr-2" size={20} />
                                    Latest Scores
                                </h2>
                                <AnimatePresence>
                                    {scores.length > 0 ? (
                                        scores.map((game, index) => (
                                            <motion.div
                                                key={index}
                                                className="mb-4 border-b border-gray-700 pb-3"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <p className="text-lg text-gray-100 font-semibold tracking-wider">
                                                        {game.shortName}
                                                    </p>
                                                    <p className="text-md sm:text-lg text-blue-400 font-bold">
                                                        {game.competitions?.[0].competitors?.[0]?.score} - {game.competitions?.[0].competitors?.[1]?.score}
                                                    </p>
                                                </div>
                                                <p className="text-xs text-gray-400">
                                                    {new Date(game.date).toLocaleDateString()}
                                                </p>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400">No scores available</p>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            {/* News Section */}
                            <motion.div
                                className="bg-gradient-to-br from-slate-900 to-black rounded-xl shadow-lg p-4 sm:p-6 border border-blue-700"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <h2 className="text-xl sm:text-2xl font-bold text-blue-400 mb-3 tracking-wide flex items-center">
                                    <Newspaper className="mr-2" size={20} />
                                    Latest News
                                </h2>
                                <AnimatePresence>
                                    {news.length > 0 ? (
                                        news.map((article, index) => (
                                            <motion.div
                                                key={index}
                                                className="mb-4 border-b border-gray-700 pb-3"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                            >
                                                <a
                                                    href={article.links?.web?.href}
                                                    className="text-lg text-blue-400 font-bold hover:underline tracking-wider flex items-center"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Flame className="mr-2" size={18} />
                                                    {article.headline}
                                                </a>
                                                <p className="text-xs text-gray-400 mt-2">{article.description}</p>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400">No news available</p>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            {/* Teams Section */}
                            <motion.div
                                className="bg-gradient-to-br from-slate-900 to-black rounded-xl shadow-lg p-4 sm:p-6 border border-blue-700"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <h2 className="text-xl sm:text-2xl font-bold text-blue-400 mb-3 tracking-wide flex items-center">
                                    <Trophy className="mr-2" size={20} />
                                    Teams
                                </h2>
                                <AnimatePresence>
                                    {teams.length > 0 ? (
                                        teams.map((team, index) => (
                                            <motion.div
                                                key={index}
                                                className="mb-4 flex items-center border-b border-gray-700 pb-3"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                            >
                                                <Image
                                                    src={team.logos?.[0]?.href}
                                                    alt={team.name}
                                                    width={48} // Adjust based on your needs
                                                    height={48} // Adjust based on your needs
                                                    className="w-12 h-12 mr-4"
                                                />
                                                <div>
                                                    <p className="text-lg text-gray-100 font-semibold tracking-wider">
                                                        {team.displayName}
                                                    </p>
                                                    <p className="text-sm text-gray-400">{team.location}</p>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400">No teams available</p>
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

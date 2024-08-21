import { useEffect, useState } from 'react';
import Layout from '../components/layout';
import axios from 'axios';

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
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-falcons-red text-white px-4 md:px-6 pt-10 md:pt-16">
                <div className="container mx-auto py-6 md:py-10">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center text-falcons-red uppercase mb-8 tracking-wide">
                        Live Sports Scores & News
                    </h1>

                    {/* Sport Selector */}
                    <div className="flex justify-center space-x-2 sm:space-x-4 mb-6 sm:mb-8">
                        {Object.keys(endpoints).map((sportKey) => (
                            <button
                                key={sportKey}
                                className={`text-sm sm:text-lg font-bold uppercase tracking-wide px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105 ${activeSport === sportKey
                                    ? 'bg-falcons-red text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                onClick={() => setActiveSport(sportKey as keyof typeof endpoints)}
                            >
                                {sportKey.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <p className="text-center text-gray-400">Loading {activeSport.toUpperCase()} data...</p>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                            {/* Scores Section */}
                            <div className="bg-gray-800 rounded-xl shadow-xl p-6 sm:p-8 transform transition-transform hover:scale-105 hover:shadow-2xl">
                                <h2 className="text-2xl sm:text-3xl font-bold text-falcons-red mb-4 tracking-wide">
                                    Latest Scores
                                </h2>
                                {scores.length > 0 ? (
                                    scores.map((game, index) => (
                                        <div key={index} className="mb-4">
                                            <p className="text-lg text-white font-semibold tracking-wider">
                                                {game.shortName}: {game.competitions?.[0].competitors?.[0]?.score} -{' '}
                                                {game.competitions?.[0].competitors?.[1]?.score}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                {new Date(game.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400">No scores available</p>
                                )}
                            </div>

                            {/* News Section */}
                            <div className="bg-gray-800 rounded-xl shadow-xl p-6 sm:p-8 transform transition-transform hover:scale-105 hover:shadow-2xl">
                                <h2 className="text-2xl sm:text-3xl font-bold text-falcons-red mb-4 tracking-wide">
                                    Latest News
                                </h2>
                                {news.length > 0 ? (
                                    news.map((article, index) => (
                                        <div key={index} className="mb-4">
                                            <a
                                                href={article.links?.web?.href}
                                                className="text-lg text-falcons-red font-bold hover:underline tracking-wider"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {article.headline}
                                            </a>
                                            <p className="text-sm text-gray-400 mt-2">{article.description}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400">No news available</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface LiveScore {
    id: string;
    sport: string;
    homeTeam: string;
    awayTeam: string;
    status: string;
    time: string;
}

const DigitalSportsSign: React.FC = () => {
    const [scores, setScores] = useState<LiveScore[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchScores = async () => {
        try {
            setLoading(true);

            // Fetch NFL scores
            const nflResponse = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard');
            const nflData = await nflResponse.json();
            const nflScores = nflData.events.slice(0, 1).map((event: any) => ({
                id: event.id,
                sport: 'NFL',
                homeTeam: event.competitions[0].competitors[0].team.displayName,
                awayTeam: event.competitions[0].competitors[1].team.displayName,
                status: event.status.type.description,
                time: event.status.type.shortDetail,
            }));

            // Fetch MLB scores
            const mlbResponse = await fetch('https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard');
            const mlbData = await mlbResponse.json();
            const mlbScores = mlbData.events.slice(0, 1).map((event: any) => ({
                id: event.id,
                sport: 'MLB',
                homeTeam: event.competitions[0].competitors[0].team.displayName,
                awayTeam: event.competitions[0].competitors[1].team.displayName,
                status: event.status.type.description,
                time: event.status.type.shortDetail,
            }));

            // Fetch NBA scores
            const nbaResponse = await fetch('https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard');
            const nbaData = await nbaResponse.json();
            const nbaScores = nbaData.events.slice(0, 1).map((event: any) => ({
                id: event.id,
                sport: 'NBA',
                homeTeam: event.competitions[0].competitors[0].team.displayName,
                awayTeam: event.competitions[0].competitors[1].team.displayName,
                status: event.status.type.description,
                time: event.status.type.shortDetail,
            }));

            // Fetch NHL scores
            const nhlResponse = await fetch('https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard');
            const nhlData = await nhlResponse.json();
            const nhlScores = nhlData.events.slice(0, 1).map((event: any) => ({
                id: event.id,
                sport: 'NHL',
                homeTeam: event.competitions[0].competitors[0].team.displayName,
                awayTeam: event.competitions[0].competitors[1].team.displayName,
                status: event.status.type.description,
                time: event.status.type.shortDetail,
            }));

            // Combine scores from all sports, ensuring only one event per sport
            setScores([...nflScores, ...mlbScores, ...nbaScores, ...nhlScores]);
            setError(null);
        } catch (err) {
            setError('Failed to fetch live scores. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScores();
        const interval = setInterval(fetchScores, 60000); // Update every 60 seconds
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 bg-zinc-900 rounded-lg">
                <RefreshCw className="w-8 h-8 text-red-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64 bg-red-900 text-white rounded-lg">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-black text-white rounded-lg shadow-2xl p-6 my-8 mx-auto max-w-4xl h-auto overflow-hidden">
            <AnimatePresence mode="wait">
                {scores.length > 0 && (
                    <motion.div
                        key={scores.map((score) => score.id).join('-')}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        {scores.map((score) => (
                            <div key={score.id} className="flex flex-col items-center justify-center">
                                <h3 className="text-3xl font-extrabold uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 mb-2">
                                    {score.sport}: {score.homeTeam} vs {score.awayTeam}
                                </h3>
                                <p className="text-sm text-gray-400">
                                    {score.status} - {score.time}
                                </p>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DigitalSportsSign;

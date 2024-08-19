import { useEffect, useState } from 'react';
import { fetchBets } from '../../lib/api';
import { Bet } from '../../lib/types';
import Link from 'next/link';
import Layout from '../../components/layout';

export default function BetsPage() {
    const [bets, setBets] = useState<Bet[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadBets() {
            try {
                const data = await fetchBets();
                setBets(data);
            } catch (error) {
                setError('Failed to load bets.');
            }
        }

        loadBets();
    }, []);

    return (
        <Layout>
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-falcons-red p-6 md:p-8">
                <div className="container mx-auto bg-gray-900 rounded-lg shadow-2xl p-6 md:p-12 mt-16 animate-fadeIn">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-center text-falcons-red animate-textGlow uppercase mb-8 md:mb-12">Active Bets</h1>
                    {error && <p className="text-red-500 text-center mb-6">{error}</p>}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {bets.map((bet) => (
                            <div
                                key={bet.id}
                                className="bg-gradient-to-br from-gray-900 via-black to-falcons-red p-6 rounded-xl shadow-2xl transform transition-transform hover:scale-105 hover:shadow-3xl animate-zoom-in"
                            >
                                <div className="text-center mb-4 md:mb-6">
                                    <p className="text-3xl md:text-4xl font-extrabold text-falcons-red mb-2 uppercase">{bet.team}</p>
                                    <p className="text-lg md:text-xl text-gray-300">vs {bet.opponent}</p>
                                    <p className="text-sm text-gray-400">{new Date(bet.date).toLocaleDateString()}</p>
                                </div>
                                <div className="text-lg space-y-2">
                                    <p className="text-white">
                                        <span className="font-semibold">Bet Amount:</span>{' '}
                                        <span className="text-green-400">${Number(bet.amount).toFixed(2)}</span>
                                    </p>
                                    <p className="text-white">
                                        <span className="font-semibold">Odds:</span> {bet.odds}
                                    </p>
                                    <p className="text-white">
                                        <span className="font-semibold">Bet Type:</span> {bet.betType}
                                    </p>
                                    <p className="text-white">
                                        <span className="font-semibold">Ticket Cost:</span> ${Number(bet.ticketCost || 0).toFixed(2)}
                                    </p>
                                    <p className="text-white">
                                        <span className="font-semibold">Potential Payout:</span> ${Number(bet.payout || 0).toFixed(2)}
                                    </p>
                                    <p className="text-white">
                                        <span className="font-semibold">Result:</span>
                                        <span
                                            className={`ml-2 px-2 py-1 rounded ${bet.result === 'win'
                                                ? 'bg-green-500'
                                                : bet.result === 'loss'
                                                    ? 'bg-red-500'
                                                    : 'bg-gray-500'
                                                } text-white`}
                                        >
                                            {bet.result?.toUpperCase()}
                                        </span>
                                    </p>
                                </div>
                                {bet.description && (
                                    <div className="mt-4 text-gray-300 italic text-center">
                                        &quot;{bet.description}&quot;
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Navigation back to home */}
                    <div className="mt-12 text-center">
                        <Link href="/" passHref>
                            <span className="inline-block bg-falcons-red text-white text-lg md:text-xl font-semibold py-3 px-8 md:px-10 rounded-lg shadow-md hover:bg-red-700 hover:text-yellow-300 transform hover:scale-105 transition-all animate-zoom-in">
                                Back to Home
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

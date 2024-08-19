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
                setError('Failed to load bets');
            }
        }

        loadBets();
    }, []);

    return (
        <Layout>
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-800 to-red-900 p-8">
                <div className="container mx-auto bg-gray-800 rounded-lg shadow-lg p-8 md:p-12 mt-16">
                    <h1 className="text-5xl font-extrabold mb-12 text-center text-red-500">Active Bets</h1>
                    {error && <p className="text-red-500 text-center mb-6">{error}</p>}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {bets.map((bet) => (
                            <div key={bet.id} className="bg-gradient-to-br from-gray-700 via-black to-red-900 p-6 rounded-2xl shadow-2xl transform transition-transform hover:scale-105 hover:shadow-3xl">
                                <div className="text-center mb-6">
                                    <p className="text-3xl font-extrabold text-red-500 mb-2">{bet.team}</p>
                                    <p className="text-xl text-gray-300">vs {bet.opponent}</p>
                                    <p className="text-sm text-gray-400">{new Date(bet.date).toLocaleDateString()}</p>
                                </div>
                                <div className="text-lg space-y-2">
                                    <p className="text-white"><span className="font-semibold">Bet Amount:</span> <span className="text-green-400">${Number(bet.amount).toFixed(2)}</span></p>
                                    <p className="text-white"><span className="font-semibold">Odds:</span> {bet.odds}</p>
                                    <p className="text-white"><span className="font-semibold">Bet Type:</span> {bet.betType}</p>
                                    <p className="text-white"><span className="font-semibold">Ticket Cost:</span> ${Number(bet.ticketCost || 0).toFixed(2)}</p>
                                    <p className="text-white"><span className="font-semibold">Potential Payout:</span> ${Number(bet.payout || 0).toFixed(2)}</p>
                                    <p className="text-white">
                                        <span className="font-semibold">Result:</span>
                                        <span className={`ml-2 px-2 py-1 rounded ${bet.result === 'win' ? 'bg-green-500' : bet.result === 'loss' ? 'bg-red-500' : 'bg-gray-500'} text-white`}>
                                            {bet.result?.toUpperCase()}
                                        </span>
                                    </p>
                                </div>
                                {bet.description && (
                                    <div className="mt-4 text-gray-300 italic text-center">
                                        "{bet.description}"
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Navigation back to home */}
                    <div className="mt-12 text-center">
                        <Link href="/" className="inline-block bg-red-600 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-red-700 transition-all">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

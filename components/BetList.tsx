import { Bet } from '../lib/types';
import { useEffect } from 'react';

export default function BetList({ bets }: { bets: Bet[] }) {
    useEffect(() => {
        console.log('Fetched Bets:', bets);
    }, [bets]);

    return (
        <div className="space-y-8 max-w-4xl mx-auto p-4 md:p-8">
            {bets.map((bet) => (
                <div
                    key={bet.id}
                    className="bg-gradient-to-br from-gray-900 via-black to-falcons-red p-6 md:p-8 rounded-xl shadow-2xl transition-transform transform hover:scale-105 hover:shadow-3xl text-white"
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
                        <div>
                            <p className="text-3xl md:text-4xl font-extrabold text-falcons-red mb-1 uppercase">{bet.team}</p>
                            <p className="text-sm text-gray-400">vs {bet.opponent}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-semibold text-gray-200">Bet Type: {bet.betType}</p>
                            <p className="text-sm text-gray-400">{new Date(bet.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-lg">
                        <div>
                            <p>Amount: <span className="font-bold text-green-400">${bet.amount.toFixed(2)}</span></p>
                            <p>Odds: <span className="font-bold text-green-400">{bet.odds}</span></p>
                        </div>
                        <div>
                            <p>Ticket Cost: <span className="font-bold text-green-400">${bet.ticketCost.toFixed(2)}</span></p>
                            <p>Payout: <span className="font-bold text-green-400">${bet.payout.toFixed(2)}</span></p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-semibold">Result:
                                <span className={`ml-2 p-2 rounded text-sm ${bet.result === 'win' ? 'bg-green-500' : bet.result === 'loss' ? 'bg-red-500' : 'bg-gray-500'} text-white`}>
                                    {bet.result.toUpperCase()}
                                </span>
                            </p>
                        </div>
                    </div>
                    {bet.description && (
                        <div className="mt-6">
                            <p className="italic text-gray-300 text-center">&quot;{bet.description}&quot;</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

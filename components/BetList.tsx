import { Bet } from '../lib/types';
import { useEffect } from 'react';

export default function BetList({ bets }: { bets: Bet[] }) {
    useEffect(() => {
        console.log('Fetched Bets:', bets);
    }, [bets]);

    return (
        <div className="space-y-6">
            {bets.map((bet) => (
                <div key={bet.id} className="border border-red-500 p-6 rounded-lg shadow-lg bg-gradient-to-br from-black to-gray-900 text-white transition-transform transform hover:scale-105 hover:shadow-2xl">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <p className="text-3xl font-extrabold tracking-widest uppercase text-red-500">{bet.team}</p>
                            <p className="text-sm text-gray-400">vs {bet.opponent}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-semibold text-red-400">Bet Type: {bet.betType}</p>
                            <p className="text-sm text-gray-400">{new Date(bet.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                        <div>
                            <p>Amount: <span className="font-bold text-yellow-500">${bet.amount.toFixed(2)}</span></p>
                            <p>Odds: <span className="font-bold text-yellow-500">{bet.odds}</span></p>
                        </div>
                        <div>
                            <p>Ticket Cost: <span className="font-bold text-yellow-500">${bet.ticketCost.toFixed(2)}</span></p>
                            <p>Payout: <span className="font-bold text-yellow-500">${bet.payout.toFixed(2)}</span></p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-semibold">Result:
                                <span className={`ml-2 p-1 rounded text-sm ${bet.result === 'win' ? 'bg-green-500' : bet.result === 'loss' ? 'bg-red-500' : 'bg-gray-500'} text-white`}>
                                    {bet.result.toUpperCase()}
                                </span>
                            </p>
                        </div>
                    </div>
                    {bet.description && (
                        <div className="mt-4">
                            <p className="italic text-gray-300">"{bet.description}"</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

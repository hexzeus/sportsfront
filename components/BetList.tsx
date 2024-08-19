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
                    className="relative bg-gradient-to-br from-falcons-red via-black to-gray-900 p-6 md:p-8 rounded-xl shadow-2xl transition-transform transform hover:scale-105 hover:shadow-3xl text-white overflow-hidden"
                >
                    {/* Diagonal Stripes for Visual Interest */}
                    <div className="absolute inset-0 z-[-1]">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 to-black opacity-50"></div>
                        <div className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-br from-red-800 to-falcons-red opacity-20 transform rotate-45"></div>
                    </div>

                    {/* Ticket Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
                        <div>
                            <p className="text-4xl md:text-5xl font-extrabold text-falcons-red mb-1 uppercase tracking-wide">{bet.team}</p>
                            <p className="text-base text-gray-400">vs {bet.opponent}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-bold text-gray-300">Bet Type: <span className="text-green-400">{bet.betType}</span></p>
                            <p className="text-sm text-gray-400">{new Date(bet.date).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Ticket Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-lg">
                        <div>
                            <p className="text-gray-300">Amount:</p>
                            <p className="text-2xl font-bold text-green-400">${bet.amount.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-gray-300">Odds:</p>
                            <p className="text-2xl font-bold text-green-400">{bet.odds}</p>
                        </div>
                        <div>
                            <p className="text-gray-300">Ticket Cost:</p>
                            <p className="text-2xl font-bold text-green-400">${bet.ticketCost.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-gray-300">Payout:</p>
                            <p className="text-2xl font-bold text-green-400">${bet.payout.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold text-gray-300">Result:</p>
                            <p className={`text-2xl font-bold p-2 rounded-md ${bet.result === 'win' ? 'bg-green-500' : bet.result === 'loss' ? 'bg-red-500' : 'bg-gray-500'} text-white`}>
                                {bet.result.toUpperCase()}
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    {bet.description && (
                        <div className="mt-6">
                            <p className="italic text-gray-400 text-center text-lg">&quot;{bet.description}&quot;</p>
                        </div>
                    )}

                    {/* Bottom Details */}
                    <div className="mt-4 flex justify-between text-sm text-gray-400">
                        <p>Bet ID: {bet.id}</p>
                        <p>Placed on: {new Date(bet.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

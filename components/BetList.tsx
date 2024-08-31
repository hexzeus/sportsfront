import { Bet } from '../lib/types';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaDollarSign, FaChartLine, FaTicketAlt, FaTrophy } from 'react-icons/fa';

export default function BetList({ bets }: { bets: Bet[] }) {
    useEffect(() => {
        console.log('Fetched Bets:', bets);
    }, [bets]);

    return (
        <div className="space-y-8 max-w-4xl mx-auto p-4 md:p-8">
            {bets.map((bet) => (
                <motion.div
                    key={bet.id}
                    className="relative bg-gradient-to-br from-gray-900 to-black p-6 md:p-8 rounded-xl shadow-2xl transition-all duration-300 hover:shadow-blue-900/50 text-white overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                >
                    {/* Background Accent */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900 to-gray-900 opacity-20"></div>
                        <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-br from-blue-700 to-blue-900 opacity-10 transform -skew-x-12"></div>
                    </div>

                    {/* Ticket Header */}
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700 mb-1 uppercase tracking-wide">{bet.team}</h2>
                            <p className="text-base text-gray-400">vs {bet.opponent}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-bold text-gray-300">Bet Type: <span className="text-blue-400">{bet.betType}</span></p>
                            <p className="text-sm text-gray-400">{new Date(bet.date).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Ticket Details */}
                    <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-lg">
                        <div className="flex items-center space-x-2">
                            <FaDollarSign className="text-blue-500 text-2xl" />
                            <div>
                                <p className="text-gray-400">Amount:</p>
                                <p className="text-2xl font-bold text-white">${bet.amount.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <FaChartLine className="text-blue-500 text-2xl" />
                            <div>
                                <p className="text-gray-400">Odds:</p>
                                <p className="text-2xl font-bold text-white">{bet.odds}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <FaTicketAlt className="text-blue-500 text-2xl" />
                            <div>
                                <p className="text-gray-400">Ticket Cost:</p>
                                <p className="text-2xl font-bold text-white">${bet.ticketCost.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <FaTrophy className="text-blue-500 text-2xl" />
                            <div>
                                <p className="text-gray-400">Payout:</p>
                                <p className="text-2xl font-bold text-white">${bet.payout.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Result */}
                    <div className="relative z-10 mt-6 flex justify-center">
                        <div className="text-center">
                            <p className="text-xl font-bold text-gray-300 mb-2">Result:</p>
                            <p className={`text-2xl font-bold py-2 px-4 rounded-md ${bet.result === 'win' ? 'bg-green-600' :
                                bet.result === 'loss' ? 'bg-red-600' : 'bg-gray-600'
                                } text-white`}>
                                {bet.result.toUpperCase()}
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    {bet.description && (
                        <div className="relative z-10 mt-6">
                            <p className="italic text-gray-400 text-center text-lg">&quot;{bet.description}&quot;</p>
                        </div>
                    )}

                    {/* Bottom Details */}
                    <div className="relative z-10 mt-4 flex justify-between text-sm text-gray-500">
                        <p>Bet ID: {bet.id}</p>
                        <p>Placed on: {new Date(bet.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

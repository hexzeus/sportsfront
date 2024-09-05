import { Bet } from '../lib/types';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, TrendingUp, Ticket, Award, Calendar, Clock, Info } from 'lucide-react';

export default function BetList({ bets }: { bets: Bet[] }) {
    useEffect(() => {
        console.log('Fetched Bets:', bets);
    }, [bets]);

    return (
        <div className="space-y-6 md:space-y-8 max-w-2xl md:max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
            <AnimatePresence>
                {bets.map((bet) => (
                    <motion.div
                        key={bet.id}
                        className="relative bg-gradient-to-br from-[#0d1117] to-black p-4 sm:p-6 rounded-xl shadow-2xl transition-all duration-300 hover:shadow-blue-900/50 text-gray-200 overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    >
                        {/* Background Accent */}
                        <div className="absolute inset-0 z-0">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900 to-gray-900 opacity-20"></div>
                            <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-br from-gray-800 to-blue-900 opacity-10 transform -skew-x-12"></div>
                        </div>

                        {/* Ticket Header */}
                        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                            <div>
                                <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-gray-400 mb-1 uppercase tracking-wide" style={{ fontFamily: 'Impact, sans-serif' }}>
                                    {bet.team}
                                </h2>
                                <p className="text-sm sm:text-base text-gray-500">vs {bet.opponent}</p>
                            </div>
                            <div className="text-left sm:text-right">
                                <p className="text-sm sm:text-lg font-bold text-gray-400">
                                    Bet Type: <span className="text-blue-400">{bet.betType}</span>
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500 flex items-center sm:justify-end">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {new Date(bet.date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* Ticket Details */}
                        <div className="relative z-10 grid grid-cols-2 gap-4 sm:gap-6 text-base sm:text-lg">
                            <div className="flex items-center space-x-2">
                                <DollarSign className="text-green-400 text-xl sm:text-2xl" />
                                <div>
                                    <p className="text-gray-500">Amount:</p>
                                    <p className="text-lg sm:text-2xl font-bold text-gray-100">${bet.amount.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <TrendingUp className="text-yellow-400 text-xl sm:text-2xl" />
                                <div>
                                    <p className="text-gray-500">Odds:</p>
                                    <p className="text-lg sm:text-2xl font-bold text-gray-100">{bet.odds}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Ticket className="text-orange-400 text-xl sm:text-2xl" />
                                <div>
                                    <p className="text-gray-500">Ticket Cost:</p>
                                    <p className="text-lg sm:text-2xl font-bold text-gray-100">${bet.ticketCost.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Award className="text-blue-400 text-xl sm:text-2xl" />
                                <div>
                                    <p className="text-gray-500">Payout:</p>
                                    <p className="text-lg sm:text-2xl font-bold text-gray-100">${bet.payout.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Result */}
                        <div className="relative z-10 mt-4 sm:mt-6 flex justify-center">
                            <motion.div
                                className="text-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <p className="text-base sm:text-xl font-bold text-gray-400 mb-2">Result:</p>
                                <p className={`text-lg sm:text-2xl font-bold py-1 px-3 sm:py-2 sm:px-4 rounded-md ${bet.result === 'win' ? 'bg-green-600' :
                                    bet.result === 'loss' ? 'bg-red-600' : 'bg-gray-600'
                                    } text-gray-100`}>
                                    {bet.result.toUpperCase()}
                                </p>
                            </motion.div>
                        </div>

                        {/* Description */}
                        {bet.description && (
                            <div className="relative z-10 mt-4 sm:mt-6">
                                <p className="italic text-gray-500 text-center text-sm sm:text-lg">&quot;{bet.description}&quot;</p>
                            </div>
                        )}

                        {/* Bottom Details */}
                        <div className="relative z-10 mt-4 sm:mt-6 flex justify-between text-xs sm:text-sm text-gray-500">
                            <p className="flex items-center">
                                <Info className="w-4 h-4 mr-1" />
                                Bet ID: {bet.id}
                            </p>
                            <p className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                Placed on: {new Date(bet.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { Bet } from '../lib/types';

interface BetFormProps {
    onSubmit: (bet: Omit<Bet, 'id'>, token: string) => Promise<void>;
    initialData?: Partial<Bet>;
}

export default function BetForm({ onSubmit, initialData = {} }: BetFormProps) {
    const [team, setTeam] = useState(initialData.team || '');
    const [opponent, setOpponent] = useState(initialData.opponent || '');
    const [amount, setAmount] = useState(initialData.amount || 0);
    const [odds, setOdds] = useState(initialData.odds || '');
    const [date, setDate] = useState(initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '');
    const [description, setDescription] = useState(initialData.description || '');
    const [result, setResult] = useState<'win' | 'loss' | 'pending'>(initialData.result || 'pending');
    const [betType, setBetType] = useState(initialData.betType || '');
    const [ticketCost, setTicketCost] = useState(initialData.ticketCost || 0);
    const [payout, setPayout] = useState(initialData.payout || 0);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        if (!token) {
            setError('You must be logged in as admin to submit bets.');
            return;
        }

        const oddsPattern = /^[+-]?\d+$/;
        if (!oddsPattern.test(odds)) {
            setError('Invalid odds. Please enter a valid number with a "+" or "-" prefix.');
            return;
        }

        const bet = {
            team,
            opponent,
            amount: parseFloat(amount.toString()),
            odds,
            date: new Date(date),
            description,
            result,
            betType,
            ticketCost: parseFloat(ticketCost.toString()),
            payout: parseFloat(payout.toString()),
        };

        try {
            await onSubmit(bet, token);
        } catch (err) {
            setError('Failed to submit bet. Please try again.');
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-falcons-black p-6 md:p-8 rounded-lg shadow-2xl text-white border border-falcons-red max-w-lg mx-auto space-y-6 transition-all duration-300"
        >
            <h2 className="text-4xl font-extrabold text-center mb-6 text-falcons-red">Create Bet Ticket</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <div className="space-y-4">
                <div>
                    <label className="block font-semibold mb-1 text-lg">Team:</label>
                    <input
                        type="text"
                        value={team}
                        onChange={(e) => setTeam(e.target.value)}
                        className="w-full p-4 border border-falcons-red rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-falcons-red transition-all duration-200"
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold mb-1 text-lg">Opponent:</label>
                    <input
                        type="text"
                        value={opponent}
                        onChange={(e) => setOpponent(e.target.value)}
                        className="w-full p-4 border border-falcons-red rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-falcons-red transition-all duration-200"
                        required
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-semibold mb-1 text-lg">Amount:</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(parseFloat(e.target.value))}
                            className="w-full p-4 border border-falcons-red rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-falcons-red transition-all duration-200"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1 text-lg">Odds:</label>
                        <input
                            type="text"
                            value={odds}
                            onChange={(e) => setOdds(e.target.value)}
                            className="w-full p-4 border border-falcons-red rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-falcons-red transition-all duration-200"
                            required
                            placeholder="+200 or -150"
                        />
                    </div>
                </div>
                <div>
                    <label className="block font-semibold mb-1 text-lg">Date:</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-4 border border-falcons-red rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-falcons-red transition-all duration-200"
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold mb-1 text-lg">Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-4 border border-falcons-red rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-falcons-red transition-all duration-200"
                        rows={4}
                    />
                </div>
                <div>
                    <label className="block font-semibold mb-1 text-lg">Result:</label>
                    <select
                        value={result}
                        onChange={(e) => setResult(e.target.value as 'win' | 'loss' | 'pending')}
                        className="w-full p-4 border border-falcons-red rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-falcons-red transition-all duration-200"
                        required
                    >
                        <option value="win">Win</option>
                        <option value="loss">Loss</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
                <div>
                    <label className="block font-semibold mb-1 text-lg">Bet Type:</label>
                    <input
                        type="text"
                        value={betType}
                        onChange={(e) => setBetType(e.target.value)}
                        className="w-full p-4 border border-falcons-red rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-falcons-red transition-all duration-200"
                        required
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-semibold mb-1 text-lg">Ticket Cost:</label>
                        <input
                            type="number"
                            value={ticketCost}
                            onChange={(e) => setTicketCost(parseFloat(e.target.value))}
                            className="w-full p-4 border border-falcons-red rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-falcons-red transition-all duration-200"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1 text-lg">Payout:</label>
                        <input
                            type="number"
                            value={payout}
                            onChange={(e) => setPayout(parseFloat(e.target.value))}
                            className="w-full p-4 border border-falcons-red rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-falcons-red transition-all duration-200"
                            required
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                className="mt-8 w-full py-4 bg-gradient-to-br from-falcons-red to-red-800 hover:from-red-600 hover:to-red-900 text-white font-bold uppercase rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
            >
                Submit Bet
            </button>
        </form>
    );
}


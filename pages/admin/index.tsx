import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Lock, Hammer, Target, Trophy, Zap, Flame, Edit, Trash2, LogOut, Plus } from 'lucide-react';
import BetForm from '../../components/BetForm';
import { fetchBets, createBet, updateBet, deleteBet } from '../../lib/api';
import { Bet } from '../../lib/types';

export default function AdminPanel() {
    const [bets, setBets] = useState<Bet[]>([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/admin/login');
        } else {
            loadBets();
        }
    }, [router]);

    const loadBets = async () => {
        try {
            const data = await fetchBets();
            setBets(data);
        } catch (err) {
            setError('Failed to load bets.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBet = async (bet: Omit<Bet, 'id'>) => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            setError('You must be logged in to create bets.');
            router.push('/admin/login');
            return;
        }

        try {
            await createBet(bet, token);
            loadBets();
        } catch (err) {
            setError('Failed to create bet.');
        }
    };

    const handleUpdateBet = async (updatedBet: Bet) => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            setError('You must be logged in to update bets.');
            router.push('/admin/login');
            return;
        }

        try {
            await updateBet(updatedBet.id, updatedBet, token);
            loadBets();
        } catch (err) {
            setError('Failed to update bet.');
        }
    };

    const handleDeleteBet = async (id: number) => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            setError('You must be logged in to delete bets.');
            router.push('/admin/login');
            return;
        }

        try {
            await deleteBet(id, token);
            loadBets();
        } catch (err) {
            setError('Failed to delete bet.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        router.push('/');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white">
                <div className="text-center space-y-4">
                    <Zap className="w-16 h-16 text-blue-500 animate-pulse mx-auto" />
                    <p className="text-3xl font-bold text-blue-300">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900 text-white overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute w-full h-full bg-[url('/noise.png')] opacity-10"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-800 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-gray-800 to-blue-900 rounded-full blur-3xl opacity-30 animate-spin-slow"></div>
            </div>
            <div className="relative z-10 container mx-auto p-6 md:p-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-between items-center mb-8 md:mb-10"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 uppercase">Admin Panel</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-blue-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 text-sm font-bold uppercase transition-all flex items-center"
                    >
                        <LogOut className="mr-2" size={18} />
                        Logout
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-6 md:mb-8 flex justify-center"
                >
                    <button
                        onClick={() => router.push('/admin/createTicketByImage')}
                        className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 px-6 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 text-sm font-bold uppercase transition-all flex items-center"
                    >
                        <Plus className="mr-2" size={18} />
                        Create Ticket by Image
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mb-6 md:mb-8"
                >
                    <BetForm onSubmit={handleCreateBet} />
                </motion.div>

                {error && <p className="text-red-500 text-center mb-8">{error}</p>}

                <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="space-y-6"
                >
                    {bets.map((bet) => (
                        <EditableBetItem
                            key={bet.id}
                            bet={bet}
                            onUpdate={handleUpdateBet}
                            onDelete={handleDeleteBet}
                        />
                    ))}
                </motion.ul>
            </div>
        </div>
    );
}

function EditableBetItem({
    bet,
    onUpdate,
    onDelete,
}: {
    bet: Bet;
    onUpdate: (bet: Bet) => void;
    onDelete: (id: number) => void;
}) {
    const [editableBet, setEditableBet] = useState<Bet>({
        ...bet,
        team: bet.team || '',
        opponent: bet.opponent || '',
        amount: bet.amount || 0,
        odds: bet.odds || '',
        description: bet.description || '',
        result: bet.result || 'pending',
        betType: bet.betType || '',
        ticketCost: bet.ticketCost || 0,
        payout: bet.payout || 0,
    });

    const handleUpdate = () => {
        onUpdate(editableBet);
    };

    const handleDelete = () => {
        onDelete(bet.id);
    };

    return (
        <motion.li
            className="p-6 bg-gray-800 bg-opacity-50 rounded-lg shadow-md border border-blue-500 space-y-4 md:space-y-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <input
                    type="text"
                    value={editableBet.team}
                    onChange={(e) => setEditableBet({ ...editableBet, team: e.target.value })}
                    className="border p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Team"
                />
                <input
                    type="text"
                    value={editableBet.opponent}
                    onChange={(e) => setEditableBet({ ...editableBet, opponent: e.target.value })}
                    className="border p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Opponent"
                />
                <input
                    type="number"
                    value={editableBet.amount}
                    onChange={(e) => setEditableBet({ ...editableBet, amount: parseFloat(e.target.value) || 0 })}
                    className="border p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Amount"
                />
                <input
                    type="text"
                    value={editableBet.odds}
                    onChange={(e) => setEditableBet({ ...editableBet, odds: e.target.value })}
                    className="border p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Odds"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <input
                    type="date"
                    value={new Date(editableBet.date).toISOString().split('T')[0]}
                    onChange={(e) => setEditableBet({ ...editableBet, date: new Date(e.target.value) })}
                    className="border p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <input
                    type="text"
                    value={editableBet.betType}
                    onChange={(e) => setEditableBet({ ...editableBet, betType: e.target.value })}
                    className="border p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Bet Type"
                />
                <input
                    type="number"
                    value={editableBet.ticketCost}
                    onChange={(e) => setEditableBet({ ...editableBet, ticketCost: parseFloat(e.target.value) || 0 })}
                    className="border p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Ticket Cost"
                />
                <input
                    type="number"
                    value={editableBet.payout}
                    onChange={(e) => setEditableBet({ ...editableBet, payout: parseFloat(e.target.value) || 0 })}
                    className="border p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Payout"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                    value={editableBet.result}
                    onChange={(e) => setEditableBet({ ...editableBet, result: e.target.value as 'win' | 'loss' | 'pending' })}
                    className="border p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                >
                    <option value="win">Win</option>
                    <option value="loss">Loss</option>
                    <option value="pending">Pending</option>
                </select>
                <button onClick={handleUpdate} className="bg-blue-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 text-sm font-bold transition-all flex items-center justify-center">
                    <Edit className="mr-2" size={18} />
                    Update Bet
                </button>
                <button onClick={handleDelete} className="bg-red-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-red-600 text-sm font-bold transition-all flex items-center justify-center">
                    <Trash2 className="mr-2" size={18} />
                    Delete Bet
                </button>
            </div>
        </motion.li>
    );
}
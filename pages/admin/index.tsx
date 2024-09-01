import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Hammer, Target, Trophy, Zap, Flame, Edit, Trash2, LogOut, Plus, AlertTriangle } from 'lucide-react';
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
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-zinc-900 via-black to-red-900 text-zinc-100">
                <div className="text-center space-y-4">
                    <Flame className="w-16 h-16 text-orange-500 animate-pulse mx-auto" />
                    <p className="text-3xl font-bold text-orange-300">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-red-900 text-zinc-100 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute w-full h-full bg-[url('/noise.png')] opacity-5"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-800 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-orange-800 to-red-900 rounded-full blur-3xl opacity-30 animate-spin-slow"></div>
            </div>
            <div className="relative z-10 container mx-auto p-6 md:p-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-between items-center mb-8 md:mb-10"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-500 to-yellow-400 uppercase" style={{ fontFamily: 'Impact, sans-serif' }}>Admin Panel</h1>
                    <motion.button
                        onClick={handleLogout}
                        className="bg-gradient-to-r from-red-600 to-orange-600 text-zinc-100 py-3 px-6 rounded-lg shadow-md hover:from-red-700 hover:to-orange-700 text-sm font-bold uppercase transition-all flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <LogOut className="mr-2" size={18} />
                        Logout
                    </motion.button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-6 md:mb-8 flex justify-center"
                >
                    <motion.button
                        onClick={() => router.push('/admin/createTicketByImage')}
                        className="bg-gradient-to-r from-orange-500 to-red-600 text-zinc-100 py-3 px-6 rounded-lg shadow-md hover:from-orange-600 hover:to-red-700 text-sm font-bold uppercase transition-all flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Plus className="mr-2" size={18} />
                        Create Ticket by Image
                    </motion.button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mb-6 md:mb-8"
                >
                    <BetForm onSubmit={handleCreateBet} />
                </motion.div>

                {error && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-500 text-center mb-8 flex items-center justify-center"
                    >
                        <AlertTriangle className="mr-2" size={18} />
                        {error}
                    </motion.p>
                )}

                <AnimatePresence>
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
                </AnimatePresence>
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
            className="p-6 bg-gradient-to-br from-zinc-900 to-black rounded-lg shadow-xl border border-red-700 space-y-4 md:space-y-6 relative overflow-hidden"
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255, 99, 71, 0.3)" }}
            transition={{ duration: 0.2 }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-orange-900/10 to-yellow-900/20 pointer-events-none"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                <input
                    type="text"
                    value={editableBet.team}
                    onChange={(e) => setEditableBet({ ...editableBet, team: e.target.value })}
                    className="border border-red-700 p-3 bg-zinc-800 text-zinc-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all placeholder-zinc-500"
                    placeholder="Team"
                />
                <input
                    type="text"
                    value={editableBet.opponent}
                    onChange={(e) => setEditableBet({ ...editableBet, opponent: e.target.value })}
                    className="border border-red-700 p-3 bg-zinc-800 text-zinc-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all placeholder-zinc-500"
                    placeholder="Opponent"
                />
                <input
                    type="number"
                    value={editableBet.amount}
                    onChange={(e) => setEditableBet({ ...editableBet, amount: parseFloat(e.target.value) || 0 })}
                    className="border border-red-700 p-3 bg-zinc-800 text-zinc-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all placeholder-zinc-500"
                    placeholder="Amount"
                />
                <input
                    type="text"
                    value={editableBet.odds}
                    onChange={(e) => setEditableBet({ ...editableBet, odds: e.target.value })}
                    className="border border-red-700 p-3 bg-zinc-800 text-zinc-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all placeholder-zinc-500"
                    placeholder="Odds"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                <input
                    type="date"
                    value={new Date(editableBet.date).toISOString().split('T')[0]}
                    onChange={(e) => setEditableBet({ ...editableBet, date: new Date(e.target.value) })}
                    className="border border-red-700 p-3 bg-zinc-800 text-zinc-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
                <input
                    type="text"
                    value={editableBet.betType}
                    onChange={(e) => setEditableBet({ ...editableBet, betType: e.target.value })}
                    className="border border-red-700 p-3 bg-zinc-800 text-zinc-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all placeholder-zinc-500"
                    placeholder="Bet Type"
                />
                <input
                    type="number"
                    value={editableBet.ticketCost}
                    onChange={(e) => setEditableBet({ ...editableBet, ticketCost: parseFloat(e.target.value) || 0 })}
                    className="border border-red-700 p-3 bg-zinc-800 text-zinc-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all placeholder-zinc-500"
                    placeholder="Ticket Cost"
                />
                <input
                    type="number"
                    value={editableBet.payout}
                    onChange={(e) => setEditableBet({ ...editableBet, payout: parseFloat(e.target.value) || 0 })}
                    className="border border-red-700 p-3 bg-zinc-800 text-zinc-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all placeholder-zinc-500"
                    placeholder="Payout"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                <select
                    value={editableBet.result}
                    onChange={(e) => setEditableBet({ ...editableBet, result: e.target.value as 'win' | 'loss' | 'pending' })}
                    className="border border-red-700 p-3 bg-zinc-800 text-zinc-100 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                >
                    <option value="win">Win</option>
                    <option value="loss">Loss</option>
                    <option value="pending">Pending</option>
                </select>
                <motion.button
                    onClick={handleUpdate}
                    className="bg-gradient-to-r from-orange-600 to-red-600 text-zinc-100 py-3 px-6 rounded-lg shadow-md hover:from-orange-700 hover:to-red-700 text-sm font-bold transition-all flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Edit className="mr-2" size={18} />
                    Update Bet
                </motion.button>
                <motion.button
                    onClick={handleDelete}
                    className="bg-gradient-to-r from-red-600 to-red-800 text-zinc-100 py-3 px-6 rounded-lg shadow-md hover:from-red-700 hover:to-red-900 text-sm font-bold transition-all flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Trash2 className="mr-2" size={18} />
                    Delete Bet
                </motion.button>
            </div>
        </motion.li>
    );
}
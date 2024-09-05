import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Edit, Trash2, LogOut, Plus, AlertTriangle } from 'lucide-react';
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
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-dark-blue to-steel-gray text-zinc-100">
                <div className="text-center space-y-4">
                    <Flame className="w-16 h-16 text-blue-500 animate-pulse mx-auto" />
                    <p className="text-3xl font-bold text-blue-300">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-dark-blue to-steel-gray text-zinc-100 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute w-full h-full bg-[url('/noise.png')] opacity-5"></div>
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-800 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-blue-900 to-steel-800 rounded-full blur-3xl opacity-30 animate-spin-slow"></div>
            </div>
            <div className="relative z-10 container mx-auto p-4 md:p-6 lg:p-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-between items-center mb-6 md:mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-steel-gray to-gray-200 uppercase">
                        Admin Panel
                    </h1>
                    <motion.button
                        onClick={handleLogout}
                        className="bg-gradient-to-r from-blue-600 to-steel-600 text-zinc-100 py-2 px-4 rounded-lg shadow-md hover:from-blue-700 hover:to-steel-700 text-xs md:text-sm font-bold uppercase transition-all flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <LogOut className="mr-1 md:mr-2" size={16} />
                        Logout
                    </motion.button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-4 md:mb-6 flex justify-center"
                >
                    <motion.button
                        onClick={() => router.push('/admin/createTicketByImage')}
                        className="bg-gradient-to-r from-steel-600 to-blue-600 text-zinc-100 py-2 px-4 rounded-lg shadow-md hover:from-steel-700 hover:to-blue-700 text-xs md:text-sm font-bold uppercase transition-all flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Plus className="mr-1 md:mr-2" size={16} />
                        Create Ticket by Image
                    </motion.button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mb-4 md:mb-6"
                >
                    <BetForm onSubmit={handleCreateBet} />
                </motion.div>

                {error && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-blue-500 text-center mb-6 flex items-center justify-center"
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
                        className="space-y-4 md:space-y-6"
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
            className="p-4 md:p-6 bg-gradient-to-br from-zinc-900 to-black rounded-lg shadow-xl border border-blue-700 space-y-3 md:space-y-4 relative overflow-hidden"
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(71, 112, 255, 0.3)" }}
            transition={{ duration: 0.2 }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-steel-900/10 to-gray-900/20 pointer-events-none"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                <input
                    type="text"
                    value={editableBet.team}
                    onChange={(e) => setEditableBet({ ...editableBet, team: e.target.value })}
                    className="border border-blue-700 p-2 md:p-3 bg-zinc-800 text-zinc-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-zinc-500 text-sm md:text-base"
                    placeholder="Team"
                />
                <input
                    type="text"
                    value={editableBet.opponent}
                    onChange={(e) => setEditableBet({ ...editableBet, opponent: e.target.value })}
                    className="border border-blue-700 p-2 md:p-3 bg-zinc-800 text-zinc-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-zinc-500 text-sm md:text-base"
                    placeholder="Opponent"
                />
                <input
                    type="number"
                    value={editableBet.amount}
                    onChange={(e) => setEditableBet({ ...editableBet, amount: parseFloat(e.target.value) || 0 })}
                    className="border border-blue-700 p-2 md:p-3 bg-zinc-800 text-zinc-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-zinc-500 text-sm md:text-base"
                    placeholder="Amount"
                />
                <input
                    type="text"
                    value={editableBet.odds}
                    onChange={(e) => setEditableBet({ ...editableBet, odds: e.target.value })}
                    className="border border-blue-700 p-2 md:p-3 bg-zinc-800 text-zinc-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder-zinc-500 text-sm md:text-base"
                    placeholder="Odds"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                <select
                    value={editableBet.result}
                    onChange={(e) => setEditableBet({ ...editableBet, result: e.target.value as 'win' | 'loss' | 'pending' })}
                    className="border border-blue-700 p-2 md:p-3 bg-zinc-800 text-zinc-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm md:text-base"
                >
                    <option value="win">Win</option>
                    <option value="loss">Loss</option>
                    <option value="pending">Pending</option>
                </select>
                <motion.button
                    onClick={handleUpdate}
                    className="bg-gradient-to-r from-steel-600 to-blue-600 text-zinc-100 py-2 px-4 md:py-3 md:px-6 rounded-lg shadow-md hover:from-steel-700 hover:to-blue-700 text-xs md:text-sm font-bold transition-all flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Edit className="mr-1 md:mr-2" size={16} />
                    Update Bet
                </motion.button>
                <motion.button
                    onClick={handleDelete}
                    className="bg-gradient-to-r from-blue-600 to-steel-800 text-zinc-100 py-2 px-4 md:py-3 md:px-6 rounded-lg shadow-md hover:from-blue-700 hover:to-steel-900 text-xs md:text-sm font-bold transition-all flex items-center justify-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Trash2 className="mr-1 md:mr-2" size={16} />
                    Delete Bet
                </motion.button>
            </div>
        </motion.li>
    );
}

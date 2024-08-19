'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
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
            router.push('/admin/login'); // Redirect to login if no token
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
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-black to-falcons-red text-white">
                <p className="text-3xl font-bold">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-black to-falcons-red text-white">
            <div className="container mx-auto p-8">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-5xl font-extrabold tracking-wide text-falcons-red uppercase">Admin Panel</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-falcons-red text-white py-3 px-6 rounded-lg shadow-md hover:bg-red-700 text-sm font-bold uppercase transition-all"
                    >
                        Logout
                    </button>
                </div>
                <div className="mb-8">
                    <BetForm onSubmit={handleCreateBet} />
                </div>
                {error && <p className="text-red-500 text-center mb-8">{error}</p>}
                <ul className="space-y-6">
                    {bets.map((bet) => (
                        <EditableBetItem
                            key={bet.id}
                            bet={bet}
                            onUpdate={handleUpdateBet}
                            onDelete={handleDeleteBet}
                        />
                    ))}
                </ul>
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
        <li className="p-6 bg-gray-900 rounded-lg shadow-md border border-falcons-red space-y-6">
            <div className="flex flex-col space-y-4 md:flex-row md:space-x-6 md:space-y-0">
                <input
                    type="text"
                    value={editableBet.team}
                    onChange={(e) => setEditableBet({ ...editableBet, team: e.target.value })}
                    className="border p-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-falcons-red flex-1"
                />
                <input
                    type="text"
                    value={editableBet.opponent}
                    onChange={(e) => setEditableBet({ ...editableBet, opponent: e.target.value })}
                    className="border p-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-falcons-red flex-1"
                />
                <input
                    type="number"
                    value={editableBet.amount}
                    onChange={(e) => setEditableBet({ ...editableBet, amount: parseFloat(e.target.value) || 0 })}
                    className="border p-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-falcons-red flex-1"
                />
                <input
                    type="text"
                    value={editableBet.odds}
                    onChange={(e) => setEditableBet({ ...editableBet, odds: e.target.value })}
                    className="border p-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-falcons-red flex-1"
                />
            </div>
            {/* Additional Fields */}
            <div className="flex flex-col space-y-4 md:flex-row md:space-x-6 md:space-y-0">
                <input
                    type="date"
                    value={new Date(editableBet.date).toISOString().split('T')[0]}
                    onChange={(e) => setEditableBet({ ...editableBet, date: new Date(e.target.value) })}
                    className="border p-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-falcons-red flex-1"
                />
                <input
                    type="text"
                    value={editableBet.betType}
                    onChange={(e) => setEditableBet({ ...editableBet, betType: e.target.value })}
                    className="border p-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-falcons-red flex-1"
                />
                <input
                    type="number"
                    value={editableBet.ticketCost}
                    onChange={(e) => setEditableBet({ ...editableBet, ticketCost: parseFloat(e.target.value) || 0 })}
                    className="border p-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-falcons-red flex-1"
                />
                <input
                    type="number"
                    value={editableBet.payout}
                    onChange={(e) => setEditableBet({ ...editableBet, payout: parseFloat(e.target.value) || 0 })}
                    className="border p-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-falcons-red flex-1"
                />
            </div>
            {/* Result & Actions */}
            <div className="flex flex-col space-y-4 md:flex-row md:space-x-6 md:space-y-0">
                <select
                    value={editableBet.result}
                    onChange={(e) => setEditableBet({ ...editableBet, result: e.target.value as 'win' | 'loss' | 'pending' })}
                    className="border p-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-falcons-red flex-1"
                >
                    <option value="win">Win</option>
                    <option value="loss">Loss</option>
                    <option value="pending">Pending</option>
                </select>
                <button onClick={handleUpdate} className="bg-blue-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 text-sm font-bold transition-all">
                    Update Bet
                </button>
                <button onClick={handleDelete} className="bg-red-500 text-white py-3 px-6 rounded-lg shadow-md hover:bg-red-600 text-sm font-bold transition-all">
                    Delete Bet
                </button>
            </div>
        </li>
    );
}

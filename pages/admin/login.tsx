import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Lock, User, AlertTriangle } from 'lucide-react';

export default function AdminLoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const credentials = btoa(`${username}:${password}`);
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/login`,
                {}, // Empty body
                {
                    headers: {
                        Authorization: `Basic ${credentials}`,
                    },
                }
            );
            const { token } = response.data;
            localStorage.setItem('adminToken', token);
            router.push('/admin');
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-dark-blue to-slate-900 text-gray-200 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-dark-blue/10 to-slate-900/20 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5"></div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-black to-slate-900 text-gray-200 shadow-2xl rounded-lg p-8 md:p-10 max-w-md w-full relative z-10"
            >
                <div className="text-center mb-8 md:mb-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-gray-500 to-slate-400 uppercase" style={{ fontFamily: 'Impact, sans-serif' }}>Admin Login</h1>
                    <p className="text-md md:text-lg text-gray-400 mt-4">Welcome back, sports mastermind!</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-6 md:space-y-8">
                    <div>
                        <label className="block text-sm font-medium text-blue-400 mb-2">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 md:py-4 border border-blue-700 bg-zinc-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-blue-400 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 md:py-4 border border-blue-700 bg-zinc-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                required
                            />
                        </div>
                    </div>
                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-500 text-center flex items-center justify-center"
                        >
                            <AlertTriangle className="mr-2" size={18} />
                            {error}
                        </motion.p>
                    )}
                    <motion.button
                        type="submit"
                        className="w-full py-3 md:py-4 bg-gradient-to-r from-blue-600 to-slate-600 hover:from-blue-700 hover:to-slate-700 text-gray-100 font-bold rounded-lg shadow-md transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Login
                    </motion.button>
                </form>
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-400">Access restricted to admin users only.</p>
                </div>
            </motion.div>
        </div>
    );
}

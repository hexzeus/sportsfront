import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black to-falcons-red text-white">
            <div className="bg-gray-900 text-white shadow-lg rounded-lg p-10 max-w-lg w-full">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-extrabold tracking-widest text-falcons-red uppercase">Admin Login</h1>
                    <p className="text-lg text-gray-400 mt-4">Welcome back, sports enthusiast!</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-4 border border-gray-700 bg-gray-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-falcons-red"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 border border-gray-700 bg-gray-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-falcons-red"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-falcons-red to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold rounded-lg shadow-md transition duration-300"
                    >
                        Login
                    </button>
                </form>
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-400">Access restricted to admin users only.</p>
                </div>
            </div>
        </div>
    );
}

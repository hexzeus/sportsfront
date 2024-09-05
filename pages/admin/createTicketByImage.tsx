"use client"; // Ensure this component is rendered on the client side

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Image from 'next/image'; // Import the Next.js Image component
import { motion } from 'framer-motion';
import { FaUpload, FaArrowLeft } from 'react-icons/fa';
import { Flame, AlertTriangle, CheckCircle } from 'lucide-react';

export default function CreateTicketByImage() {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null); // This stores the image URL for updates
    const [team, setTeam] = useState<string>(''); // Custom input for team name
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isUpdateMode, setIsUpdateMode] = useState(false); // This toggles create or update mode
    const router = useRouter();
    const { ticketId } = router.query; // We assume ticketId is passed via query parameters

    // Auto-filled fields - these are hidden from the user
    const autoFilledFields = {
        opponent: "Default Opponent",
        amount: 100, // Auto-filled default amount
        odds: "+100", // Default odds
        date: new Date().toISOString().split('T')[0], // Current date
        result: "pending", // Default result
        betType: "Moneyline", // Default bet type
        ticketCost: 10, // Default ticket cost
        payout: 200 // Default payout
    };

    // If ticketId exists, switch to update mode and fetch the ticket data
    useEffect(() => {
        if (ticketId) {
            setIsUpdateMode(true);
            fetchTicket(ticketId as string);
        }
    }, [ticketId]);

    const fetchTicket = async (id: string) => {
        try {
            const { data } = await axios.get(
                `https://sportsback.onrender.com/api/get-ticket/${id}`
            );
            setImageUrl(data.description);
            setTeam(data.team || ''); // Set the team name to the fetched ticket data or empty string
        } catch (err) {
            setError('Failed to load ticket details.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let uploadedImageUrl = imageUrl;

        // Retrieve the token from localStorage or sessionStorage
        const token = localStorage.getItem('adminToken');

        if (!token) {
            setError("Admin token not found. Please log in again.");
            return;
        }

        // If the user uploads a new image, upload it to S3
        if (imageFile) {
            try {
                const { data: uploadURL } = await axios.post(
                    'https://sportsback.onrender.com/api/s3/get-upload-url',
                    {
                        fileName: imageFile.name,
                        fileType: imageFile.type,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                await axios.put(uploadURL, imageFile, {
                    headers: {
                        'Content-Type': imageFile.type,
                    },
                });

                // Store the uploaded image URL
                uploadedImageUrl = uploadURL.split('?')[0];
            } catch (err) {
                setError('Failed to upload image.');
                return;
            }
        }

        // Ensure the team field is filled
        if (!team.trim()) {
            setError("Team name is required.");
            return;
        }

        // Create the payload with the custom team name and the uploaded image URL
        const payload = {
            team, // Use the custom team input
            ...autoFilledFields, // These hidden fields are sent along with the image URL
            description: uploadedImageUrl, // Store image URL in the description field
        };

        try {
            if (isUpdateMode) {
                // If in update mode, update the ticket
                await axios.put(
                    `https://sportsback.onrender.com/api/update-ticket/${ticketId}`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setSuccess('Ticket successfully updated!');
            } else {
                // Otherwise, create a new ticket
                await axios.post(
                    'https://sportsback.onrender.com/api/tickets/create-ticket',
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setSuccess('Ticket successfully created!');
            }

            setError('');
        } catch (err) {
            setError('Failed to submit ticket.');
            setSuccess('');
        }
    };

    const handleBackToAdmin = () => {
        // Navigate back to the admin panel
        router.push('/admin');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute w-full h-full bg-[url('/noise.png')] opacity-5"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-800 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-800 to-gray-900 rounded-full blur-3xl opacity-30 animate-spin-slow"></div>
            </div>

            <div className="max-w-3xl mx-auto relative z-10">
                <motion.h1
                    className="text-4xl sm:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-gray-500 to-gray-300 mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ fontFamily: 'Impact, sans-serif' }}
                >
                    {isUpdateMode ? 'Update Ticket by Image' : 'Create Ticket by Image'}
                </motion.h1>

                {error && (
                    <motion.p
                        className="text-red-500 text-center mb-4 font-semibold flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <AlertTriangle className="mr-2" size={18} />
                        {error}
                    </motion.p>
                )}
                {success && (
                    <motion.p
                        className="text-green-500 text-center mb-4 font-semibold flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <CheckCircle className="mr-2" size={18} />
                        {success}
                    </motion.p>
                )}

                <motion.form
                    onSubmit={handleSubmit}
                    className="space-y-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <div className="space-y-4">
                        <label htmlFor="team" className="block text-lg font-medium text-blue-400">Custom Tag for Admin Panel</label>
                        <input
                            id="team"
                            type="text"
                            value={team}
                            onChange={(e) => setTeam(e.target.value)}
                            className="block w-full p-4 bg-zinc-800 text-zinc-100 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                            placeholder="Enter custom tag"
                        />
                    </div>

                    {imageUrl && !imageFile && (
                        <motion.div
                            className="flex justify-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Image
                                src={imageUrl}
                                alt="Ticket Image"
                                width={500}
                                height={500}
                                className="rounded-lg shadow-xl"
                            />
                        </motion.div>
                    )}

                    <div className="space-y-4">
                        <label htmlFor="image-upload" className="block text-lg font-medium text-blue-400">Upload Image</label>
                        <div className="relative">
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                                className="hidden"
                            />
                            <label
                                htmlFor="image-upload"
                                className="flex items-center justify-center w-full p-4 bg-zinc-800 text-zinc-100 rounded-lg border border-gray-700 cursor-pointer hover:bg-zinc-700 transition duration-300"
                            >
                                <FaUpload className="mr-2 text-blue-500" />
                                {imageFile ? imageFile.name : 'Choose an image file'}
                            </label>
                        </div>
                    </div>

                    <motion.button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-gray-600 text-zinc-100 text-lg font-bold rounded-lg shadow-xl hover:from-blue-700 hover:to-gray-700 transition duration-300 flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Flame className="mr-2" size={20} />
                        {isUpdateMode ? 'Update Ticket' : 'Submit Ticket'}
                    </motion.button>
                </motion.form>

                <motion.div
                    className="mt-12 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <motion.button
                        onClick={handleBackToAdmin}
                        className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-gray-800 to-gray-700 text-zinc-100 text-lg font-semibold rounded-full shadow-lg hover:from-gray-700 hover:to-gray-600 transition duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Admin Panel
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
}

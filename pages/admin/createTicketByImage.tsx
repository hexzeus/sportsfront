"use client"; // Ensure this component is rendered on the client side

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Image from 'next/image'; // Import the Next.js Image component
import { motion } from 'framer-motion';
import { FaUpload, FaArrowLeft } from 'react-icons/fa';

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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <motion.h1
                    className="text-4xl sm:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700 mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {isUpdateMode ? 'Update Ticket by Image' : 'Create Ticket by Image'}
                </motion.h1>

                {error && <p className="text-red-500 text-center mb-4 font-semibold">{error}</p>}
                {success && <p className="text-green-500 text-center mb-4 font-semibold">{success}</p>}

                <motion.form
                    onSubmit={handleSubmit}
                    className="space-y-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <div className="space-y-4">
                        <label htmlFor="team" className="block text-lg font-medium text-red-400">Custom Tag for Admin Panel</label>
                        <input
                            id="team"
                            type="text"
                            value={team}
                            onChange={(e) => setTeam(e.target.value)}
                            className="block w-full p-4 bg-gray-800 text-white rounded-lg border border-red-700 focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-300"
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
                        <label htmlFor="image-upload" className="block text-lg font-medium text-red-400">Upload Image</label>
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
                                className="flex items-center justify-center w-full p-4 bg-gray-800 text-white rounded-lg border border-red-700 cursor-pointer hover:bg-gray-700 transition duration-300"
                            >
                                <FaUpload className="mr-2" />
                                {imageFile ? imageFile.name : 'Choose an image file'}
                            </label>
                        </div>
                    </div>

                    <motion.button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-red-600 to-red-800 text-white text-lg font-bold rounded-lg shadow-xl hover:from-red-700 hover:to-red-900 transition duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isUpdateMode ? 'Update Ticket' : 'Submit Ticket'}
                    </motion.button>
                </motion.form>

                <motion.div
                    className="mt-12 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <button
                        onClick={handleBackToAdmin}
                        className="inline-flex items-center justify-center px-8 py-3 bg-gray-800 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-gray-700 transition duration-300"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Admin Panel
                    </button>
                </motion.div>
            </div>
        </div>
    );
}

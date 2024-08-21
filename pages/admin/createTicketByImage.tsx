"use client"; // Ensure this component is rendered on the client side

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Image from 'next/image'; // Import the Next.js Image component

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
        <div className="min-h-screen bg-gradient-to-r from-black to-falcons-red text-white">
            <div className="container mx-auto p-6">
                <h1 className="text-4xl font-extrabold text-center text-falcons-red mb-8">
                    {isUpdateMode ? 'Update Ticket by Image' : 'Create Ticket by Image'}
                </h1>

                {error && <p className="text-red-500 text-center">{error}</p>}
                {success && <p className="text-green-500 text-center">{success}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Custom team input */}
                    <input
                        type="text"
                        value={team}
                        onChange={(e) => setTeam(e.target.value)}
                        className="block w-full p-4 bg-gray-800 text-white rounded-lg border border-falcons-red"
                        placeholder="Enter a custom tag to easily identify this bet ticket in the admin panel"
                    />

                    {/* Display the uploaded image if present */}
                    {imageUrl && !imageFile && (
                        <div className="flex justify-center">
                            <Image
                                src={imageUrl}
                                alt="Ticket Image"
                                width={500}
                                height={500}
                                className="rounded-lg shadow-md"
                            />
                        </div>
                    )}

                    {/* File upload input */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                        className="block w-full p-4 bg-gray-800 text-white rounded-lg border border-falcons-red"
                    />

                    <button
                        type="submit"
                        className="block w-full py-4 bg-falcons-red text-white rounded-lg"
                    >
                        {isUpdateMode ? 'Update Ticket' : 'Submit Ticket'}
                    </button>
                </form>

                {/* Smooth navigation back to admin panel */}
                <div className="mt-8 text-center">
                    <button
                        onClick={handleBackToAdmin}
                        className="inline-block bg-gray-800 text-white py-4 px-8 rounded-full shadow-lg hover:bg-gray-700 hover:scale-105 transform transition-transform duration-300"
                    >
                        Back to Admin Panel
                    </button>
                </div>
            </div>
        </div>
    );
}

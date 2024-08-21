import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Image from 'next/image'; // Import the Next.js Image component

export default function CreateTicketByImage() {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [result, setResult] = useState<'win' | 'loss' | 'pending'>('pending');
    const [imageUrl, setImageUrl] = useState<string | null>(null); // This stores the image URL for updates
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isUpdateMode, setIsUpdateMode] = useState(false); // This toggles create or update mode
    const router = useRouter();
    const { ticketId } = router.query; // We assume ticketId is passed via query parameters

    useEffect(() => {
        // If there is a ticketId, fetch the ticket data to populate the form for updating
        if (ticketId) {
            setIsUpdateMode(true);
            fetchTicket(ticketId as string);
        }
    }, [ticketId]);

    const fetchTicket = async (id: string) => {
        try {
            const { data } = await axios.get(`/api/get-ticket/${id}`);
            setImageUrl(data.description); // Assume image URL is stored in description
            setResult(data.result);
        } catch (err) {
            setError('Failed to load ticket details.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let uploadedImageUrl = imageUrl;

        // If a new image is uploaded, process it
        if (imageFile) {
            try {
                const { data: uploadURL } = await axios.post('/api/get-upload-url', {
                    fileName: imageFile.name,
                    fileType: imageFile.type,
                });

                // Upload the file directly to S3 using the presigned URL
                await axios.put(uploadURL, imageFile, {
                    headers: {
                        'Content-Type': imageFile.type,
                    },
                });

                // Save the new image URL
                uploadedImageUrl = uploadURL.split('?')[0];
            } catch (err) {
                setError('Failed to upload image.');
                return;
            }
        }

        try {
            if (isUpdateMode) {
                // Update the existing ticket
                await axios.put(`/api/update-ticket/${ticketId}`, {
                    description: uploadedImageUrl, // Storing image URL in description field
                    result, // Update the result (win/loss/pending)
                });
                setSuccess('Ticket successfully updated!');
            } else {
                // Create a new ticket
                await axios.post('/api/create-ticket', {
                    description: uploadedImageUrl, // Storing image URL in description field
                    result, // Set result as win/loss/pending
                });
                setSuccess('Ticket successfully created!');
            }

            setError('');
        } catch (err) {
            setError('Failed to submit ticket.');
            setSuccess('');
        }
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
                    {/* Display existing image if in update mode */}
                    {imageUrl && !imageFile && (
                        <div className="flex justify-center">
                            <Image
                                src={imageUrl}
                                alt="Ticket Image"
                                width={500}  // Set the image width
                                height={500} // Set the image height
                                className="rounded-lg shadow-md"
                            />
                        </div>
                    )}

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                        className="block w-full p-4 bg-gray-800 text-white rounded-lg border border-falcons-red"
                    />

                    <select
                        value={result}
                        onChange={(e) => setResult(e.target.value as 'win' | 'loss' | 'pending')}
                        className="block w-full p-4 bg-gray-800 text-white rounded-lg border border-falcons-red"
                    >
                        <option value="win">Win</option>
                        <option value="loss">Loss</option>
                        <option value="pending">Pending</option>
                    </select>

                    <button
                        type="submit"
                        className="block w-full py-4 bg-falcons-red text-white rounded-lg"
                    >
                        {isUpdateMode ? 'Update Ticket' : 'Submit Ticket'}
                    </button>
                </form>
            </div>
        </div>
    );
}

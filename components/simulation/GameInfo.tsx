import React from 'react';
import { Clock, Calendar } from 'lucide-react';

interface GameInfoProps {
    currentTime: Date | null;
}

const GameInfo: React.FC<GameInfoProps> = ({ currentTime }) => {
    const formattedDate = currentTime?.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const formattedTime = currentTime?.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    return (
        <div className="flex flex-col sm:flex-row justify-center items-center w-full bg-gradient-to-r from-zinc-800 to-zinc-900 p-3 sm:p-4 rounded-lg shadow-md border-2 border-gray-600">
            <div className="text-center sm:mr-6">
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-yellow-500 animate-pulse flex items-center justify-center">
                    <Clock className="inline-block w-6 h-6 sm:w-8 sm:h-8 mr-2" />
                    {formattedTime}
                </div>
            </div>

            <div className="text-center sm:ml-6 mt-2 sm:mt-0">
                <div className="text-sm sm:text-lg md:text-xl lg:text-2xl font-medium text-zinc-300 flex items-center justify-center">
                    <Calendar className="inline-block w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                    {formattedDate}
                </div>
            </div>
        </div>
    );
};


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
        <div className="flex justify-between items-center w-full">
            <div className="text-center">
                <div className="text-sm sm:text-base md:text-lg font-bold text-orange-500 animate-pulse">
                    <Clock className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                    {formattedTime}
                </div>
                <div className="text-xs sm:text-sm md:text-base font-medium text-zinc-400">
                    <Calendar className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                    {formattedDate}
                </div>
            </div>
        </div>
    );
};

export default GameInfo;
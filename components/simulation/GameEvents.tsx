import React from 'react';
import { Activity } from 'lucide-react';

interface GameEventsProps {
    events: string[];
}

const GameEvents: React.FC<GameEventsProps> = ({ events }) => {
    return (
        <div className="bg-gradient-to-r from-black via-gray-900 to-black w-full p-3 sm:p-4 rounded-lg shadow-md border-t-4 border-b-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                    <Activity className="text-green-500 w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                    <span className="text-sm sm:text-lg font-semibold text-green-400 uppercase tracking-wider animate-pulse">
                        Game Events
                    </span>
                </div>
                <span className="text-gray-400 text-xs sm:text-sm">Live</span>
            </div>

            <div className="h-28 sm:h-36 overflow-y-auto text-xs sm:text-sm text-gray-300 space-y-2 pr-2 custom-scrollbar">
                {events.map((event, index) => (
                    <div
                        key={index}
                        className="bg-gray-800 bg-opacity-50 p-2 rounded-md border-l-4 border-green-500 shadow-sm leading-snug"
                    >
                        {event}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameEvents;

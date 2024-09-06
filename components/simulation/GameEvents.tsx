import React from 'react';
import { Activity } from 'lucide-react';

interface GameEventsProps {
    events: string[];
}

const GameEvents: React.FC<GameEventsProps> = ({ events }) => {
    return (
        <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 w-full p-3 sm:p-4 rounded-xl shadow-lg border border-zinc-700">
            <div className="flex items-center mb-2">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-500" />
                <span className="text-md sm:text-lg font-bold text-zinc-300">Game Events</span>
            </div>
            <div className="text-xs sm:text-sm text-zinc-300 h-20 sm:h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent">
                {events.map((event, index) => (
                    <p key={index} className="leading-relaxed">{event}</p>
                ))}
            </div>
        </div>
    );
};

export default GameEvents;

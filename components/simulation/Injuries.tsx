import React from 'react';
import { Flag } from 'lucide-react';

interface InjuriesProps {
    homeInjuries: string[];
    awayInjuries: string[];
    homeTeamName: string;
    awayTeamName: string;
}

const Injuries: React.FC<InjuriesProps> = ({ homeInjuries, awayInjuries, homeTeamName, awayTeamName }) => {
    if (homeInjuries.length === 0 && awayInjuries.length === 0) return null;

    return (
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 w-full p-3 sm:p-4 rounded-xl shadow-lg border border-zinc-700">
            <div className="flex items-center mb-2">
                <Flag className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-red-500" />
                <span className="text-md sm:text-lg font-bold text-zinc-300">Injuries</span>
            </div>
            <div className="text-xs sm:text-sm text-zinc-300">
                <p>{homeTeamName}: {homeInjuries.join(', ') || 'None'}</p>
                <p>{awayTeamName}: {awayInjuries.join(', ') || 'None'}</p>
            </div>
        </div>
    );
};

export default Injuries;

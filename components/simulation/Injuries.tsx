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
        <div className="bg-gradient-to-r from-black via-gray-900 to-black w-full p-3 sm:p-4 rounded-lg shadow-md border-t-4 border-b-4 border-red-600">
            <div className="flex items-center space-x-2 mb-2">
                <Flag className="text-red-600 w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                <span className="text-sm sm:text-lg font-semibold text-red-500 uppercase tracking-wider">
                    Injuries
                </span>
            </div>

            <div className="text-xs sm:text-sm text-gray-300 space-y-2">
                {/* Home Team Injuries */}
                <div className="bg-gray-800 bg-opacity-60 p-2 rounded-md border-l-4 border-yellow-500">
                    <p className="font-bold text-yellow-400">{homeTeamName}</p>
                    <p>{homeInjuries.length > 0 ? homeInjuries.join(', ') : 'No injuries reported'}</p>
                </div>

                {/* Away Team Injuries */}
                <div className="bg-gray-800 bg-opacity-60 p-2 rounded-md border-l-4 border-yellow-500">
                    <p className="font-bold text-yellow-400">{awayTeamName}</p>
                    <p>{awayInjuries.length > 0 ? awayInjuries.join(', ') : 'No injuries reported'}</p>
                </div>
            </div>
        </div>
    );
};

export default Injuries;

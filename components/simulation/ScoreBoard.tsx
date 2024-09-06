import React from 'react';
import Image from 'next/image';
import { Clock, Flag } from 'lucide-react';

interface Team {
    name: string;
    abbreviation: string;
    color: string;
    logo: string;
}

interface GameState {
    homeScore: number;
    awayScore: number;
    quarter: number;
    timeLeft: string;
    possession: 'home' | 'away';
    down: number;  // New down property
    yardsToGo: number;  // New yardage property
    penalties: { home: number; away: number };
    turnovers: { home: number; away: number };
    timeoutsLeft: { home: number; away: number };
}

interface ScoreBoardProps {
    gameState: GameState;
    homeTeam: Team | null;
    awayTeam: Team | null;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ gameState, homeTeam, awayTeam }) => {
    return (
        <div className="bg-gradient-to-br from-gray-800 via-black to-gray-900 border-4 border-gray-700 rounded-xl p-4 shadow-3xl max-w-4xl mx-auto space-y-6 text-center transform-gpu hover:scale-105 transition-transform duration-500 ease-out">
            <div className="grid grid-cols-3 items-center">
                {/* Home Team */}
                <TeamDisplay team={homeTeam} />

                {/* Timer & Quarter */}
                <div className="text-center relative">
                    <div className="bg-gradient-to-b from-gray-900 to-black rounded-lg px-2 py-1 sm:px-2 sm:py-2 shadow-inner border-t-2 border-gray-700">
                        <span className="font-digital text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-yellow-400 pulse-timer shadow-timer">
                            {gameState.timeLeft}
                        </span>
                    </div>
                    <span className="text-md sm:text-lg md:text-xl lg:text-2xl font-bold text-yellow-500 mt-1 sm:mt-2 block">
                        Q{gameState.quarter}
                    </span>
                </div>


                {/* Away Team */}
                <TeamDisplay team={awayTeam} />
            </div>

            {/* Score Display */}
            <div className="grid grid-cols-3 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold">
                <span className="text-center" style={{ color: homeTeam?.color }}>
                    {gameState.homeScore}
                </span>
                {/* Smaller, more professional "VS" */}
                <span className="text-center text-yellow-400 text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-widest">
                    VS
                </span>
                <span className="text-center" style={{ color: awayTeam?.color }}>
                    {gameState.awayScore}
                </span>
            </div>


            {/* Possession */}
            <div className="text-center text-sm sm:text-base md:text-lg mt-2 text-gray-300">
                <p>Possession: {gameState.possession === 'home' ? homeTeam?.abbreviation : awayTeam?.abbreviation}</p>
            </div>

            {/* Down & Yardage */}
            <div className="text-center text-xl sm:text-2xl md:text-3xl font-bold text-blue-300 mt-4">
                <p>
                    {/* Converting down to readable format */}
                    {`${gameState.down}${['st', 'nd', 'rd', 'th'][gameState.down - 1] || 'th'} & ${gameState.yardsToGo}`}
                </p>
            </div>

            {/* Penalties and Turnovers */}
            <div className="flex justify-between text-xs sm:text-sm md:text-base text-gray-400 px-4">
                <span>Penalties: {gameState.penalties.home} - {gameState.penalties.away}</span>
                <span>Turnovers: {gameState.turnovers.home} - {gameState.turnovers.away}</span>
            </div>

            {/* Timeouts with Tooltip */}
            <div className="flex justify-between items-center text-xs sm:text-sm md:text-base text-gray-300 px-4">
                <div className="flex items-center space-x-1 relative group">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                    <span className="text-gray-400">TO</span>
                    <span className="text-yellow-500"> {gameState.timeoutsLeft.home}</span>
                    <span className="text-gray-300">(Home)</span>

                    {/* Tooltip */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-200 ease-out bg-black text-white text-xs rounded-lg shadow-lg px-2 py-1">
                        Timeouts Remaining
                    </div>
                </div>

                <div className="flex items-center space-x-1 relative group">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                    <span className="text-gray-400">TO</span>
                    <span className="text-yellow-500"> {gameState.timeoutsLeft.away}</span>
                    <span className="text-gray-300">(Away)</span>

                    {/* Tooltip */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-200 ease-out bg-black text-white text-xs rounded-lg shadow-lg px-2 py-1">
                        Timeouts Remaining
                    </div>
                </div>
            </div>
        </div>
    );
};

const TeamDisplay: React.FC<{ team: Team | null }> = ({ team }) => (
    <div className="flex flex-col items-center">
        <Image
            src={team?.logo || '/fallback.png'}
            alt={team?.name || 'Team'}
            width={64}
            height={64}
            className="sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 mb-2 shadow-lg border-b-4 border-gray-800 rounded-full"
        />
        <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-shadow-blue" style={{ color: team?.color }}>
            {team?.abbreviation}
        </span>
    </div>
);

export default ScoreBoard;

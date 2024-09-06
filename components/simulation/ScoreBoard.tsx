import React from 'react';
import Image from 'next/image';

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
    penalties: { home: number; away: number };
    turnovers: { home: number; away: number };
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
                    <div className="bg-gradient-to-b from-gray-900 to-black rounded-lg px-2 py-2 shadow-inner border-t-2 border-gray-700">
                        <span className="font-digital text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-yellow-400 pulse-timer shadow-timer">
                            {gameState.timeLeft}
                        </span>
                    </div>
                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-500 mt-2 block">
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
                <span className="text-center text-yellow-400 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">VS</span>
                <span className="text-center" style={{ color: awayTeam?.color }}>
                    {gameState.awayScore}
                </span>
            </div>

            {/* Possession */}
            <div className="text-center text-sm sm:text-base md:text-lg mt-2 text-gray-300">
                <p>Possession: {gameState.possession === 'home' ? homeTeam?.abbreviation : awayTeam?.abbreviation}</p>
            </div>

            {/* Penalties and Turnovers */}
            <div className="flex justify-between text-xs sm:text-sm md:text-base text-gray-400 px-4">
                <span>Penalties: {gameState.penalties.home} - {gameState.penalties.away}</span>
                <span>Turnovers: {gameState.turnovers.home} - {gameState.turnovers.away}</span>
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

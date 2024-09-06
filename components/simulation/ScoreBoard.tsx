import React from 'react';
import Image from 'next/image';
import { Clock, Flag, Zap } from 'lucide-react';

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
    down: number;
    yardsToGo: number;
    penalties: { home: number; away: number };
    turnovers: { home: number; away: number };
    timeoutsLeft: { home: number; away: number };
    fieldPosition: number;
}

interface ScoreBoardProps {
    gameState: GameState;
    homeTeam: Team | null;
    awayTeam: Team | null;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ gameState, homeTeam, awayTeam }) => {
    return (
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 border-4 border-yellow-500 rounded-2xl p-6 shadow-[0_0_50px_rgba(234,179,8,0.3)] max-w-5xl mx-auto space-y-8 text-center transform-gpu hover:scale-[1.02] transition-all duration-500 ease-out">
            <div className="grid grid-cols-3 items-center gap-4">
                <TeamDisplay team={homeTeam} isHome={true} />
                <TimerDisplay gameState={gameState} />
                <TeamDisplay team={awayTeam} isHome={false} />
            </div>

            <ScoreDisplay gameState={gameState} homeTeam={homeTeam} awayTeam={awayTeam} />

            <GameInfo gameState={gameState} homeTeam={homeTeam} awayTeam={awayTeam} />

            <DownAndYardage gameState={gameState} />

            <GameStats gameState={gameState} />

            <TimeoutsDisplay gameState={gameState} />
        </div>
    );
};

const TeamDisplay: React.FC<{ team: Team | null; isHome: boolean }> = ({ team, isHome }) => (
    <div className={`flex flex-col items-center ${isHome ? 'animate-pulse-slow' : ''}`}>
        <div className="relative">
            <Image
                src={team?.logo || '/fallback.png'}
                alt={team?.name || 'Team'}
                width={100}
                height={100}
                className="sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 mb-2 drop-shadow-[0_5px_5px_rgba(0,0,0,0.3)]"
            />
            {isHome && <Zap className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-pulse" />}
        </div>
        <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-shadow-lg" style={{ color: team?.color }}>
            {team?.abbreviation}
        </span>
    </div>
);

const TimerDisplay: React.FC<{ gameState: GameState }> = ({ gameState }) => (
    <div className="text-center relative w-full max-w-[180px] mx-auto">
        <div className="relative bg-gray-900 rounded-sm p-0.5 sm:p-1 shadow-lg border border-yellow-500 sm:border-2">
            <div className="bg-black rounded-sm p-1 sm:p-2 flex flex-col items-center">
                <span className="font-['Digital-7'] text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-yellow-400 tracking-wider drop-shadow-[0_0_6px_rgba(234,179,8,0.8)]">
                    {gameState.timeLeft}
                </span>
                <span className="text-[10px] sm:text-xs md:text-sm font-bold text-yellow-500 mt-0.5 sm:mt-1">
                    Q{gameState.quarter}
                </span>
            </div>
        </div>
        <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 sm:h-1 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 rounded-full shadow-[0_0_6px_rgba(234,179,8,0.7)]"></div>
    </div>
);

const ScoreDisplay: React.FC<{ gameState: GameState; homeTeam: Team | null; awayTeam: Team | null }> = ({ gameState, homeTeam, awayTeam }) => (
    <div className="grid grid-cols-3 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold bg-gradient-to-r from-gray-800 via-black to-gray-800 rounded-xl py-4 px-2 shadow-inner">
        <span className="text-center" style={{ color: homeTeam?.color }}>
            {gameState.homeScore}
        </span>
        <span className="text-center text-yellow-400 text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-widest font-light">
            VS
        </span>
        <span className="text-center" style={{ color: awayTeam?.color }}>
            {gameState.awayScore}
        </span>
    </div>
);

const GameInfo: React.FC<{ gameState: GameState; homeTeam: Team | null; awayTeam: Team | null }> = ({ gameState, homeTeam, awayTeam }) => (
    <div className="text-center text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 bg-black bg-opacity-50 rounded-lg py-2 px-4">
        <p>
            Possession: <span className="font-bold text-yellow-400">{gameState.possession === 'home' ? homeTeam?.abbreviation : awayTeam?.abbreviation}</span>
        </p>
    </div>
);

const DownAndYardage: React.FC<{ gameState: GameState }> = ({ gameState }) => (
    <div className="text-center text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white tracking-wide">
        <p className="bg-gradient-to-r from-gray-800 via-black to-gray-800 p-4 rounded-lg shadow-md border-t-4 border-yellow-500 inline-flex items-center justify-center space-x-3 mx-auto">
            <span>{`${gameState.down}${['st', 'nd', 'rd', 'th'][gameState.down - 1] || 'th'} & ${gameState.yardsToGo}`}</span>
            <span className="text-yellow-400">{`at ${gameState.fieldPosition} yd line`}</span>
        </p>
    </div>
);

const GameStats: React.FC<{ gameState: GameState }> = ({ gameState }) => (
    <div className="flex justify-between text-sm sm:text-base md:text-lg text-gray-300 px-4 bg-black bg-opacity-30 rounded-lg py-2">
        <span>Penalties: <span className="text-red-400 font-semibold">{gameState.penalties.home} - {gameState.penalties.away}</span></span>
        <span>Turnovers: <span className="text-red-400 font-semibold">{gameState.turnovers.home} - {gameState.turnovers.away}</span></span>
    </div>
);

const TimeoutsDisplay: React.FC<{ gameState: GameState }> = ({ gameState }) => (
    <div className="flex justify-between items-center text-sm sm:text-base md:text-lg text-gray-300 px-4">
        <TimeoutInfo side="Home" timeouts={gameState.timeoutsLeft.home} />
        <TimeoutInfo side="Away" timeouts={gameState.timeoutsLeft.away} />
    </div>
);

const TimeoutInfo: React.FC<{ side: string; timeouts: number }> = ({ side, timeouts }) => (
    <div className="flex items-center space-x-2 relative group">
        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
        <span className="text-gray-400">TO</span>
        <span className="text-yellow-500 font-bold">{timeouts}</span>
        <span className="text-gray-300">({side})</span>
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-out bg-black text-white text-xs rounded-lg shadow-lg px-2 py-1">
            Timeouts Remaining
        </div>
    </div>
);

export default ScoreBoard;
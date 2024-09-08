import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Trophy, Hammer } from 'lucide-react';
import confetti from 'canvas-confetti';
import TeamInfo from './TeamInfo'; // Import the new TeamInfo component

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
    down: number;
    yardsToGo: number;
    fieldPosition: number;
    possession: 'home' | 'away';
    gameStatus: 'Not Started' | 'In Progress' | 'Finished' | 'Overtime';
    lastPlay: string;
    driveStatus: string;
    playType: 'normal' | 'kickoff' | 'extraPoint' | 'twoPointConversion';
    timeoutsLeft: { home: number; away: number };
    penalties: { home: number; away: number };
    turnovers: { home: number; away: number };
}

interface ScoreBoardProps {
    gameState: GameState;
    homeTeam: Team | null;
    awayTeam: Team | null;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ gameState, homeTeam, awayTeam }) => {
    const [showCelebration, setShowCelebration] = useState(false);

    useEffect(() => {
        if (gameState.gameStatus === 'Finished' && !showCelebration) {
            setShowCelebration(true);
            triggerCelebration();
        }
    }, [gameState.gameStatus, showCelebration]);

    const triggerCelebration = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
        });

        let count = 0;
        const interval = setInterval(() => {
            confetti({
                particleCount: 50,
                angle: count % 2 === 0 ? 60 : 120,
                spread: 55,
                origin: { x: count % 2 === 0 ? 0 : 1 },
            });

            count += 1;
            if (count === 5) clearInterval(interval);
        }, 2000);
    };

    const getWinningTeam = () => {
        if (gameState.homeScore > gameState.awayScore) return homeTeam;
        if (gameState.awayScore > gameState.homeScore) return awayTeam;
        return null; // It's a tie
    };

    const winningTeam = getWinningTeam();

    return (
        <div className="bg-gradient-to-br from-gray-800 via-black to-gray-900 border-4 border-gray-700 rounded-xl p-4 shadow-3xl max-w-4xl mx-auto space-y-6 text-center transform-gpu hover:scale-105 transition-transform duration-500 ease-out">
            {/* Celebration Overlay */}
            {showCelebration && (
                <div className="celebration-overlay absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50 rounded-xl">
                    <Trophy className="text-yellow-400 w-24 h-24 mb-4 animate-bounce" />
                    <h1 className="text-4xl font-bold text-white mb-2">Game Over!</h1>
                    {winningTeam ? (
                        <>
                            <h2 className="text-3xl font-semibold text-yellow-400 mb-4">{winningTeam.name} Wins!</h2>
                            <div className="flex items-center space-x-4">
                                <Image
                                    src={winningTeam.logo}
                                    alt={winningTeam.name}
                                    width={100}
                                    height={100}
                                    className="animate-pulse"
                                />
                                <div className="text-5xl font-bold" style={{ color: winningTeam.color }}>
                                    {gameState.homeScore} - {gameState.awayScore}
                                </div>
                            </div>
                        </>
                    ) : (
                        <h2 className="text-3xl font-semibold text-yellow-400 mb-4">It&#39;s a Tie!</h2>
                    )}
                    <Hammer className="text-red-500 w-16 h-16 mt-6 animate-spin" />
                </div>
            )}

            {/* Main Content */}
            <div className="grid grid-cols-3 items-center justify-items-center">
                {/* Home Team Info */}
                <TeamInfo team={homeTeam} timeoutsLeft={gameState.timeoutsLeft.home} side="home" />

                {/* Timer Display */}
                <TimerDisplay quarter={gameState.quarter} timeLeft={gameState.timeLeft} />

                {/* Away Team Info */}
                <TeamInfo team={awayTeam} timeoutsLeft={gameState.timeoutsLeft.away} side="away" />
            </div>

            {/* Score Display */}
            <ScoreDisplay
                homeScore={gameState.homeScore}
                awayScore={gameState.awayScore}
                homeColor={homeTeam?.color}
                awayColor={awayTeam?.color}
            />

            {/* Possession Display */}
            <PossessionDisplay
                possession={gameState.possession}
                homeAbbr={homeTeam?.abbreviation}
                awayAbbr={awayTeam?.abbreviation}
            />

            {/* Down and Yardage */}
            <DownAndYardage
                down={gameState.down}
                yardsToGo={gameState.yardsToGo}
                possession={gameState.possession}
                fieldPosition={gameState.fieldPosition}
            />

            {/* Game Stats */}
            <GameStats
                penalties={gameState.penalties}
                turnovers={gameState.turnovers}
            />
        </div>
    );
};

// TimerDisplay component with fade-in animation
const TimerDisplay: React.FC<{ quarter: number; timeLeft: string }> = ({ quarter, timeLeft }) => {
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setFadeIn(true);
        }, 1000); // Increased delay to 1000ms for smoother fade-in

        return () => clearTimeout(timeout); // Clean up timeout on unmount
    }, []);

    return (
        <div
            className={`text-center relative w-full max-w-[260px] mx-auto flex justify-center transition-opacity duration-3000 ease-in-out ${fadeIn ? 'opacity-100' : 'opacity-0'
                }`}
        >
            <div className="relative bg-gradient-to-b from-gray-800 via-gray-900 to-black rounded-lg p-3 sm:p-5 shadow-lg">
                <div className="bg-black bg-opacity-80 rounded-md p-2 sm:p-3 flex flex-col items-center justify-center border border-gray-700 shadow-inner">
                    {/* Responsive font size for timeLeft */}
                    <span className="font-['Digital-7'] text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-yellow-300 tracking-wider leading-none drop-shadow-[0_0_7px_rgba(234,179,8,0.7)]">
                        {timeLeft}
                    </span>
                    {/* Responsive font size for quarter */}
                    <span className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-yellow-500 mt-1 sm:mt-2">
                        Q{quarter}
                    </span>
                </div>
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4/5 h-1 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 rounded-full opacity-60 blur-[2px] sm:blur-[3px]"></div>
        </div>
    );
};

const ScoreDisplay: React.FC<{ homeScore: number; awayScore: number; homeColor?: string; awayColor?: string }> = ({ homeScore, awayScore, homeColor, awayColor }) => (
    <div className="grid grid-cols-3 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold">
        <span className="text-center" style={{ color: homeColor }}>
            {homeScore}
        </span>
        <span className="text-center text-yellow-400 text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-widest">
            VS
        </span>
        <span className="text-center" style={{ color: awayColor }}>
            {awayScore}
        </span>
    </div>
);

const PossessionDisplay: React.FC<{ possession: 'home' | 'away'; homeAbbr?: string; awayAbbr?: string }> = ({ possession, homeAbbr, awayAbbr }) => (
    <div className="text-center text-sm sm:text-base md:text-lg mt-2 text-gray-300">
        <p>Possession: {possession === 'home' ? homeAbbr : awayAbbr}</p>
    </div>
);

const DownAndYardage: React.FC<{ down: number; yardsToGo: number; possession: 'home' | 'away'; fieldPosition: number }> = ({ down, yardsToGo, possession, fieldPosition }) => (
    <div className="text-center text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-100 tracking-wide mt-2">
        <p className="bg-gray-900 p-3 rounded-md shadow-md border-t-4 border-yellow-500 inline-flex items-center justify-center space-x-2 mx-auto max-w-full">
            <span>{`${down}${['st', 'nd', 'rd', 'th'][down - 1] || 'th'} & ${yardsToGo}`}</span>
            <span className="text-yellow-400">{`at ${possession.toUpperCase()} ${fieldPosition} yd line`}</span>
        </p>
    </div>
);

const GameStats: React.FC<{ penalties: { home: number; away: number }; turnovers: { home: number; away: number } }> = ({ penalties, turnovers }) => (
    <div className="flex justify-between text-xs sm:text-sm md:text-base text-gray-400 px-4">
        <span>Penalties: {penalties.home} - {penalties.away}</span>
        <span>Turnovers: {turnovers.home} - {turnovers.away}</span>
    </div>
);

export default ScoreBoard;

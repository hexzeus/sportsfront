import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Clock, Trophy, Hammer } from 'lucide-react';
import confetti from 'canvas-confetti';

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
    gameStatus: 'Not Started' | 'In Progress' | 'Finished';
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
            origin: { y: 0.6 }
        });

        // Repeat confetti every 2 seconds for 10 seconds
        let count = 0;
        const interval = setInterval(() => {
            confetti({
                particleCount: 50,
                angle: count % 2 === 0 ? 60 : 120,
                spread: 55,
                origin: { x: count % 2 === 0 ? 0 : 1 }
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
            {showCelebration ? (
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
                        <h2 className="text-3xl font-semibold text-yellow-400 mb-4">It's a Tie!</h2>
                    )}
                    <Hammer className="text-red-500 w-16 h-16 mt-6 animate-spin" />
                </div>
            ) : null}

            <div className="grid grid-cols-3 items-center">
                <TeamDisplay team={homeTeam} />
                <TimerDisplay quarter={gameState.quarter} timeLeft={gameState.timeLeft} />
                <TeamDisplay team={awayTeam} />
            </div>

            <ScoreDisplay
                homeScore={gameState.homeScore}
                awayScore={gameState.awayScore}
                homeColor={homeTeam?.color}
                awayColor={awayTeam?.color}
            />

            <PossessionDisplay
                possession={gameState.possession}
                homeAbbr={homeTeam?.abbreviation}
                awayAbbr={awayTeam?.abbreviation}
            />

            <DownAndYardage
                down={gameState.down}
                yardsToGo={gameState.yardsToGo}
                possession={gameState.possession}
                fieldPosition={gameState.fieldPosition}
            />

            <GameStats
                penalties={gameState.penalties}
                turnovers={gameState.turnovers}
            />

            <TimeoutsDisplay timeoutsLeft={gameState.timeoutsLeft} />
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

const TimerDisplay: React.FC<{ quarter: number; timeLeft: string }> = ({ quarter, timeLeft }) => (
    <div className="text-center relative w-full max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[260px] mx-auto">
        <div className="relative bg-gradient-to-b from-gray-800 via-gray-900 to-black rounded-lg p-2 sm:p-3 md:p-4 lg:p-5
            shadow-[0_4px_6px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]
            transform transition-all duration-300 
            hover:scale-[1.03] hover:shadow-[0_6px_12px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]">
            <div className="bg-black bg-opacity-80 rounded-md p-1 sm:p-2 md:p-3 
                flex flex-col items-center justify-center
                border border-gray-700 shadow-inner">
                <span className="font-['Digital-7'] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 
                     text-yellow-300 tracking-wider leading-none
                     drop-shadow-[0_0_7px_rgba(234,179,8,0.7)]">
                    {timeLeft}
                </span>
                <span className="text-[10px] sm:text-xs md:text-sm lg:text-base 
                     font-bold text-yellow-500 mt-1 md:mt-2">
                    Q{quarter}
                </span>
            </div>
        </div>
        <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 
            w-4/5 h-0.5 sm:h-1 md:h-1.5
            bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 
            rounded-full opacity-60 blur-[2px] sm:blur-[3px]"></div>
    </div>
);

const ScoreDisplay: React.FC<{ homeScore: number; awayScore: number; homeColor?: string; awayColor?: string }> =
    ({ homeScore, awayScore, homeColor, awayColor }) => (
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

const PossessionDisplay: React.FC<{ possession: 'home' | 'away'; homeAbbr?: string; awayAbbr?: string }> =
    ({ possession, homeAbbr, awayAbbr }) => (
        <div className="text-center text-sm sm:text-base md:text-lg mt-2 text-gray-300">
            <p>Possession: {possession === 'home' ? homeAbbr : awayAbbr}</p>
        </div>
    );

const DownAndYardage: React.FC<{ down: number; yardsToGo: number; possession: 'home' | 'away'; fieldPosition: number }> =
    ({ down, yardsToGo, possession, fieldPosition }) => (
        <div className="text-center text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-100 tracking-wide mt-2">
            <p className="bg-gray-900 p-3 rounded-md shadow-md border-t-4 border-yellow-500 inline-flex items-center justify-center space-x-2 mx-auto max-w-full">
                <span>{`${down}${['st', 'nd', 'rd', 'th'][down - 1] || 'th'} & ${yardsToGo}`}</span>
                <span className="text-yellow-400">{`at ${possession.toUpperCase()} ${fieldPosition} yd line`}</span>
            </p>
        </div>
    );

const GameStats: React.FC<{ penalties: { home: number; away: number }; turnovers: { home: number; away: number } }> =
    ({ penalties, turnovers }) => (
        <div className="flex justify-between text-xs sm:text-sm md:text-base text-gray-400 px-4">
            <span>Penalties: {penalties.home} - {penalties.away}</span>
            <span>Turnovers: {turnovers.home} - {turnovers.away}</span>
        </div>
    );

const TimeoutsDisplay: React.FC<{ timeoutsLeft: { home: number; away: number } }> = ({ timeoutsLeft }) => (
    <div className="flex justify-between items-center text-xs sm:text-sm md:text-base text-gray-300 px-4">
        <TimeoutIndicator team="Home" count={timeoutsLeft.home} />
        <TimeoutIndicator team="Away" count={timeoutsLeft.away} />
    </div>
);

const TimeoutIndicator: React.FC<{ team: string; count: number }> = ({ team, count }) => (
    <div className="flex items-center space-x-1 relative group">
        <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
        <span className="text-gray-400">TO</span>
        <span className="text-yellow-500"> {count}</span>
        <span className="text-gray-300">({team})</span>
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-200 ease-out bg-black text-white text-xs rounded-lg shadow-lg px-2 py-1">
            Timeouts Remaining
        </div>
    </div>
);

export default ScoreBoard;
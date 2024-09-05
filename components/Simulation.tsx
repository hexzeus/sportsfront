import React, { useEffect, useState, useCallback } from 'react';
import { Clock, Calendar, Trophy, Radio, Activity } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';

const ESPN_NFL_TEAMS_API = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams';

const COMMENTATORS = [
    "Joe Buck", "Troy Aikman", "Al Michaels", "Cris Collinsworth", "Jim Nantz", "Tony Romo"
];

const Simulation: React.FC = () => {
    const [homeTeam, setHomeTeam] = useState<any>(null);
    const [awayTeam, setAwayTeam] = useState<any>(null);
    const [teams, setTeams] = useState<any[]>([]);
    const [homeScore, setHomeScore] = useState(0);
    const [awayScore, setAwayScore] = useState(0);
    const [quarter, setQuarter] = useState(1);
    const [timeLeft, setTimeLeft] = useState("15:00");
    const [commentary, setCommentary] = useState<string[]>([]);
    const [down, setDown] = useState(1);
    const [yardsToGo, setYardsToGo] = useState(10);
    const [fieldPosition, setFieldPosition] = useState(20);
    const [possession, setPossession] = useState<string>("");
    const [gameStatus, setGameStatus] = useState("Not Started");
    const [winner, setWinner] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    const [animated, setAnimated] = useState(false);
    const [commentators, setCommentators] = useState<string[]>([]);
    const [lastPlay, setLastPlay] = useState<string>("");
    const [driveStatus, setDriveStatus] = useState<string>("");
    const [isMounted, setIsMounted] = useState(false);

    // Fetch teams from ESPN API
    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get(ESPN_NFL_TEAMS_API);
                const teamData = response.data.sports[0].leagues[0].teams.map((team: any) => ({
                    name: team.team.displayName,
                    abbreviation: team.team.abbreviation,
                    color: `#${team.team.color}`,
                    logo: team.team.logos[0].href
                }));
                setTeams(teamData);
            } catch (error) {
                console.error('Error fetching NFL teams:', error);
            }
        };
        fetchTeams();
    }, []);

    // Select random teams when teams are loaded
    useEffect(() => {
        if (teams.length > 0) {
            const selectRandomTeams = () => {
                let home = teams[Math.floor(Math.random() * teams.length)];
                let away = teams[Math.floor(Math.random() * teams.length)];
                while (away.abbreviation === home.abbreviation) {
                    away = teams[Math.floor(Math.random() * teams.length)];
                }
                setHomeTeam(home);
                setAwayTeam(away);
                setPossession(Math.random() < 0.5 ? home.abbreviation : away.abbreviation);
            };
            selectRandomTeams();

            const selectCommentators = () => {
                const shuffled = COMMENTATORS.sort(() => 0.5 - Math.random());
                setCommentators(shuffled.slice(0, 2));
            };
            selectCommentators();
        }
    }, [teams]);

    const addCommentary = useCallback((message: string) => {
        setCommentary(prev => [message, ...prev.slice(0, 4)]);
    }, []);

    const getRandomPlayer = useCallback(() => {
        const positions = ['QB', 'RB', 'WR', 'TE', 'K'];
        const position = positions[Math.floor(Math.random() * positions.length)];
        const number = Math.floor(Math.random() * 99) + 1;
        return `#${number} ${position}`;
    }, []);

    const updateDriveStatus = useCallback(() => {
        const currentTeam = possession === homeTeam?.abbreviation ? homeTeam : awayTeam;
        const yardLine = fieldPosition > 50 ? 100 - fieldPosition : fieldPosition;
        const side = fieldPosition > 50 ? "opponent's" : "own";
        setDriveStatus(`${currentTeam?.name} ${down}${['st', 'nd', 'rd'][down - 1] || 'th'} & ${yardsToGo} at ${side} ${yardLine}`);
    }, [possession, homeTeam, awayTeam, down, yardsToGo, fieldPosition]);

    const generatePlay = useCallback(() => {
        if (!homeTeam || !awayTeam) return;

        const playTypes = ['run', 'pass', 'sack', 'turnover', 'special'];
        const playType = playTypes[Math.floor(Math.random() * playTypes.length)];
        let yards = 0;
        let commentary = '';

        const currentTeam = possession === homeTeam.abbreviation ? homeTeam : awayTeam;
        const opponentTeam = possession === homeTeam.abbreviation ? awayTeam : homeTeam;
        const offensivePlayer = getRandomPlayer();
        const defensivePlayer = getRandomPlayer();

        // Generate commentary based on play type
        switch (playType) {
            case 'run':
                yards = Math.floor(Math.random() * 15) - 2;
                commentary = yards > 0
                    ? `${currentTeam.name}'s ${offensivePlayer} bursts through the line for a gain of ${yards} yards!`
                    : `${opponentTeam.name}'s defense stuffs ${currentTeam.name}'s ${offensivePlayer} for a loss of ${Math.abs(yards)} yards.`;
                break;
            case 'pass':
                yards = Math.floor(Math.random() * 40) - 5;
                if (yards > 0) {
                    commentary = yards > 20
                        ? `What a throw! ${currentTeam.name}'s ${offensivePlayer} connects on a ${yards}-yard bomb!`
                        : `${currentTeam.name}'s ${offensivePlayer} finds an open receiver for ${yards} yards.`;
                } else {
                    commentary = `${currentTeam.name}'s pass falls incomplete. Great coverage by ${opponentTeam.name}'s secondary.`;
                }
                break;
            case 'sack':
                yards = -Math.floor(Math.random() * 10) - 1;
                commentary = `Sack! ${opponentTeam.name}'s ${defensivePlayer} takes down the quarterback for a loss of ${Math.abs(yards)} yards!`;
                break;
            case 'turnover':
                if (Math.random() < 0.5) {
                    commentary = `Interception! ${opponentTeam.name}'s ${defensivePlayer} picks off the pass!`;
                } else {
                    commentary = `Fumble! ${opponentTeam.name} recovers the ball!`;
                }
                setPossession(prev => prev === homeTeam.abbreviation ? awayTeam.abbreviation : homeTeam.abbreviation);
                setDown(1);
                setYardsToGo(10);
                setFieldPosition(100 - fieldPosition);
                break;
            case 'special':
                if (Math.random() < 0.2) {
                    yards = Math.floor(Math.random() * 60) + 20;
                    commentary = `Incredible! ${currentTeam.name} pulls off a trick play for a massive gain of ${yards} yards!`;
                } else if (Math.random() < 0.5) {
                    commentary = `${currentTeam.name} attempts a field goal...`;
                    if (Math.random() < 0.8) {
                        commentary += " It's good!";
                        currentTeam.abbreviation === homeTeam.abbreviation ? setHomeScore(prev => prev + 3) : setAwayScore(prev => prev + 3);
                    } else {
                        commentary += " It's no good! The kick sails wide.";
                    }
                    setPossession(prev => prev === homeTeam.abbreviation ? awayTeam.abbreviation : homeTeam.abbreviation);
                    setDown(1);
                    setYardsToGo(10);
                    setFieldPosition(100 - fieldPosition);
                } else {
                    commentary = `${currentTeam.name} punts the ball away.`;
                    setPossession(prev => prev === homeTeam.abbreviation ? awayTeam.abbreviation : homeTeam.abbreviation);
                    setDown(1);
                    setYardsToGo(10);
                    setFieldPosition(Math.min(80, 100 - fieldPosition));
                }
                break;
        }

        // Manage field position, down, and play outcome
        if (playType !== 'turnover' && playType !== 'special') {
            setFieldPosition(prev => Math.min(Math.max(prev + yards, 0), 100));
            setYardsToGo(prev => Math.max(prev - yards, 0));
            setDown(prev => prev + 1);

            if (yardsToGo <= yards) {
                setDown(1);
                setYardsToGo(10);
                addCommentary(`${currentTeam.name} picks up a new set of downs!`);
            } else if (down === 4) {
                if (fieldPosition > 65) {
                    commentary = `${currentTeam.name} lines up for a field goal attempt...`;
                    if (Math.random() < 0.8) {
                        commentary += " It's good!";
                        currentTeam.abbreviation === homeTeam.abbreviation ? setHomeScore(prev => prev + 3) : setAwayScore(prev => prev + 3);
                    } else {
                        commentary += " The kick is no good!";
                    }
                } else {
                    commentary = `${currentTeam.name} punts the ball away.`;
                }
                setPossession(prev => prev === homeTeam.abbreviation ? awayTeam.abbreviation : homeTeam.abbreviation);
                setDown(1);
                setYardsToGo(10);
                setFieldPosition(100 - fieldPosition);
            }
        }

        // Touchdown scenario
        if (fieldPosition >= 100) {
            commentary = `Touchdown ${currentTeam.name}! The crowd goes wild!`;
            currentTeam.abbreviation === homeTeam.abbreviation ? setHomeScore(prev => prev + 7) : setAwayScore(prev => prev + 7);
            setPossession(prev => prev === homeTeam.abbreviation ? awayTeam.abbreviation : homeTeam.abbreviation);
            setDown(1);
            setYardsToGo(10);
            setFieldPosition(20);
        }

        setLastPlay(commentary);
        addCommentary(commentary);
        updateDriveStatus();
    }, [
        possession,
        down,
        yardsToGo,
        fieldPosition,
        addCommentary,
        homeTeam,
        awayTeam,
        getRandomPlayer,
        updateDriveStatus
    ]);

    const determineWinner = useCallback(() => {
        if (homeScore > awayScore) {
            setWinner(homeTeam.abbreviation);
            addCommentary(`${homeTeam.name} clinch a thrilling victory!`);
        } else if (awayScore > homeScore) {
            setWinner(awayTeam.abbreviation);
            addCommentary(`${awayTeam.name} secure an impressive win on the road!`);
        } else {
            setWinner("TIE");
            addCommentary("An incredible game ends in a dramatic tie!");
        }
    }, [homeScore, awayScore, addCommentary, homeTeam, awayTeam]);

    useEffect(() => {
        setAnimated(true);
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (gameStatus === "Not Started" && homeTeam && awayTeam) {
            setGameStatus("In Progress");
            addCommentary(`Welcome to this exciting matchup between ${homeTeam.name} and ${awayTeam.name}!`);
            addCommentary(`I'm ${commentators[0]} joined by ${commentators[1]}. We're in for a treat today!`);
        }

        if (gameStatus !== "In Progress") return;

        const gameTimer = setInterval(() => {
            setTimeLeft(prev => {
                const [minutes, seconds] = prev.split(':').map(Number);
                if (minutes === 0 && seconds === 0) {
                    if (quarter < 4) {
                        setQuarter(prev => prev + 1);
                        addCommentary(`That's the end of Q${quarter}. The teams are heading to the sidelines for a quick break.`);
                        return "15:00";
                    } else {
                        clearInterval(gameTimer);
                        setGameStatus("Finished");
                        determineWinner();
                        return "00:00";
                    }
                }
                const totalSeconds = minutes * 60 + seconds - 15;
                const newMinutes = Math.floor(totalSeconds / 60);
                const newSeconds = totalSeconds % 60;
                return `${String(Math.max(0, newMinutes)).padStart(2, '0')}:${String(Math.max(0, newSeconds)).padStart(2, '0')}`;
            });

            generatePlay();

        }, 3000);  // Update every 3 seconds for a manageable pace

        return () => clearInterval(gameTimer);
    }, [gameStatus, quarter, generatePlay, addCommentary, determineWinner, homeTeam, awayTeam, commentators]);

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

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div className="w-full max-w-2xl sm:max-w-3xl bg-zinc-900 bg-opacity-80 rounded-2xl p-4 sm:p-6 shadow-2xl border border-zinc-700">
            <div className="flex flex-col items-center space-y-4 sm:space-y-6">
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
                    {/* Main logo */}
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20">
                        <Image
                            src="/file.png"
                            alt="NFL Game Simulation Logo"
                            fill
                            sizes="(max-width: 768px) 48px, (max-width: 1024px) 64px, 80px"
                            style={{ objectFit: 'contain' }}
                            priority
                            className="drop-shadow-xl animate-pulse"
                        />
                    </div>
                </div>

                {/* Scoreboard with logos above team names */}
                <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 w-full p-3 sm:p-4 rounded-xl shadow-lg border border-zinc-700">
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 text-lg sm:text-2xl md:text-3xl font-bold">
                        <div className="flex flex-col items-center">
                            <Image
                                src={homeTeam?.logo || '/fallback.png'}
                                alt={`${homeTeam?.name} logo`}
                                width={64}
                                height={64}
                                className="object-contain mb-2"
                            />
                            <span className="text-red-500 animate-pulse" style={isMounted ? { color: homeTeam?.color } : undefined}>
                                {homeTeam?.abbreviation || "HOME"}
                            </span>
                        </div>
                        <div className="text-zinc-100 flex items-center justify-center">
                            {timeLeft}
                        </div>
                        <div className="flex flex-col items-center">
                            <Image
                                src={awayTeam?.logo || '/fallback.png'}
                                alt={`${awayTeam?.name} logo`}
                                width={64}
                                height={64}
                                className="object-contain mb-2"
                            />
                            <span className="text-orange-500 animate-pulse" style={isMounted ? { color: awayTeam?.color } : undefined}>
                                {awayTeam?.abbreviation || "AWAY"}
                            </span>
                        </div>
                        <div className="text-red-500 text-center" style={isMounted ? { color: homeTeam?.color } : undefined}>
                            {homeScore}
                        </div>
                        <div className="text-yellow-500 text-base sm:text-xl md:text-2xl text-center">Q{quarter}</div>
                        <div className="text-orange-500 text-center" style={isMounted ? { color: awayTeam?.color } : undefined}>
                            {awayScore}
                        </div>
                    </div>
                    <div className="mt-2 sm:mt-4 text-xs sm:text-sm md:text-base font-semibold text-zinc-300 text-center">
                        {gameStatus === "In Progress" ? driveStatus : gameStatus}
                    </div>
                    {winner && (
                        <div className="mt-4 text-lg sm:text-xl md:text-2xl font-bold flex items-center justify-center animate-bounce">
                            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-yellow-500" />
                            {winner === "TIE" ? "It's a Tie!" : `${winner === homeTeam?.abbreviation ? homeTeam?.name : awayTeam?.name} Wins!`}
                        </div>
                    )}
                </div>

                <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 w-full p-3 sm:p-4 rounded-xl shadow-lg border border-zinc-700">
                    <div className="flex items-center justify-center mb-2 animate-pulse">
                        <Radio className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-500" />
                        <span className="text-md sm:text-lg md:text-xl font-bold text-zinc-300">Live Commentary</span>
                    </div>
                    <div className="space-y-2 h-24 sm:h-32 md:h-40 overflow-y-auto text-xs sm:text-sm md:text-base">
                        {commentary.map((comment, index) => (
                            <p key={index} className="animate-fadeIn">{comment}</p>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 w-full p-3 sm:p-4 rounded-xl shadow-lg border border-zinc-700">
                    <div className="flex items-center mb-2">
                        <Activity className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-500" />
                        <span className="text-md sm:text-lg font-bold text-zinc-300">Last Play</span>
                    </div>
                    <div className="text-xs sm:text-sm text-zinc-300 h-10 sm:h-12 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent">
                        <p className="leading-relaxed">{lastPlay}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Simulation;

import React, { useEffect, useState, useCallback } from 'react';
import { Clock, Calendar, Trophy, Radio, Activity, Flag, Users, Zap } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';

const ESPN_NFL_TEAMS_API = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams';

const COMMENTATORS = [
    "Joe Buck", "Troy Aikman", "Al Michaels", "Cris Collinsworth", "Jim Nantz", "Tony Romo"
];

interface Team {
    name: string;
    abbreviation: string;
    color: string;
    logo: string;
    offense: number;
    defense: number;
    specialTeams: number;
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
    gameStatus: string;
    lastPlay: string;
    driveStatus: string;
    playType: 'normal' | 'kickoff' | 'extraPoint' | 'twoPointConversion';
    timeoutsLeft: { home: number; away: number };
    penalties: { home: number; away: number };
    turnovers: { home: number; away: number };
}

const Simulation: React.FC = () => {
    const [homeTeam, setHomeTeam] = useState<Team | null>(null);
    const [awayTeam, setAwayTeam] = useState<Team | null>(null);
    const [teams, setTeams] = useState<Team[]>([]);
    const [gameState, setGameState] = useState<GameState>({
        homeScore: 0,
        awayScore: 0,
        quarter: 1,
        timeLeft: "15:00",
        down: 1,
        yardsToGo: 10,
        fieldPosition: 25,
        possession: 'home',
        gameStatus: "Not Started",
        lastPlay: "",
        driveStatus: "",
        playType: 'kickoff',
        timeoutsLeft: { home: 3, away: 3 },
        penalties: { home: 0, away: 0 },
        turnovers: { home: 0, away: 0 },
    });
    const [commentary, setCommentary] = useState<string[]>([]);
    const [winner, setWinner] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    const [animated, setAnimated] = useState(false);
    const [commentators, setCommentators] = useState<string[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const [coinTossWinner, setCoinTossWinner] = useState<'home' | 'away' | null>(null);
    const [coinTossChoice, setCoinTossChoice] = useState<'receive' | 'kick' | null>(null);
    const [showCoinAnimation, setShowCoinAnimation] = useState(false);
    const [gameEvents, setGameEvents] = useState<string[]>([]);
    const [injuries, setInjuries] = useState<{ home: string[], away: string[] }>({ home: [], away: [] });
    const [weather, setWeather] = useState<string>('Clear');
    const [crowd, setCrowd] = useState<number>(0);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get(ESPN_NFL_TEAMS_API);
                const teamData = response.data.sports[0].leagues[0].teams.map((team: any) => ({
                    name: team.team.displayName,
                    abbreviation: team.team.abbreviation,
                    color: `#${team.team.color}`,
                    logo: team.team.logos[0].href,
                    offense: Math.floor(Math.random() * 20) + 70,
                    defense: Math.floor(Math.random() * 20) + 70,
                    specialTeams: Math.floor(Math.random() * 20) + 70,
                }));
                setTeams(teamData);
            } catch (error) {
                console.error('Error fetching NFL teams:', error);
            }
        };
        fetchTeams();
    }, []);

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
        const positions = ['QB', 'RB', 'WR', 'TE', 'K', 'P', 'CB', 'S', 'LB', 'DE', 'DT'];
        const position = positions[Math.floor(Math.random() * positions.length)];
        const number = Math.floor(Math.random() * 99) + 1;
        return `#${number} ${position}`;
    }, []);

    const updateDriveStatus = useCallback((state: GameState) => {
        const currentTeam = state.possession === 'home' ? homeTeam : awayTeam;
        const yardLine = state.fieldPosition > 50 ? 100 - state.fieldPosition : state.fieldPosition;
        const side = state.fieldPosition > 50 ? "opponent's" : "own";
        return `${currentTeam?.name} ${state.down}${['st', 'nd', 'rd'][state.down - 1] || 'th'} & ${state.yardsToGo} at ${side} ${yardLine}`;
    }, [homeTeam, awayTeam]);

    const coinToss = useCallback(() => {
        setShowCoinAnimation(true);
        setTimeout(() => {
            const winner = Math.random() < 0.5 ? 'home' : 'away';
            setCoinTossWinner(winner);
            const choice = Math.random() < 0.5 ? 'receive' : 'kick';
            setCoinTossChoice(choice);
            const receivingTeam = choice === 'receive' ? winner : (winner === 'home' ? 'away' : 'home');
            setGameState(prev => ({
                ...prev,
                possession: receivingTeam,
                playType: 'kickoff',
                gameStatus: "In Progress"
            }));
            setShowCoinAnimation(false);
            addCommentary(`${winner === 'home' ? homeTeam?.name : awayTeam?.name} wins the coin toss and elects to ${choice}!`);
        }, 3000);
    }, [homeTeam, awayTeam, addCommentary]);

    const kickoff = useCallback((state: GameState): GameState => {
        const kickingTeam = state.possession === 'home' ? awayTeam : homeTeam;
        const kickDistance = Math.floor(Math.random() * 15) + 60;
        const returnDistance = Math.floor(Math.random() * 30);
        const newFieldPosition = Math.min(Math.max(20, 100 - kickDistance + returnDistance), 50);
        const newState: GameState = {
            ...state,
            fieldPosition: newFieldPosition,
            down: 1,
            yardsToGo: 10,
            possession: state.possession === 'home' ? 'away' : 'home',
            playType: 'normal'
        };
        addCommentary(`${kickingTeam?.name} kicks off. The receiving team starts at their own ${newFieldPosition}-yard line.`);
        return newState;
    }, [homeTeam, awayTeam, addCommentary]);

    const extraPoint = useCallback((state: GameState): GameState => {
        const scoringTeam = state.possession === 'home' ? homeTeam : awayTeam;
        const specialTeamsRating = scoringTeam?.specialTeams || 80;
        const successRate = specialTeamsRating / 100;
        if (Math.random() < successRate) {
            const newState: GameState = {
                ...state,
                homeScore: state.possession === 'home' ? state.homeScore + 1 : state.homeScore,
                awayScore: state.possession === 'away' ? state.awayScore + 1 : state.awayScore,
                playType: 'kickoff',
                possession: state.possession === 'home' ? 'away' : 'home'
            };
            addCommentary(`Extra point is good! ${scoringTeam?.name} adds one more to their score.`);
            return newState;
        } else {
            addCommentary("The extra point attempt is no good!");
            return {
                ...state,
                playType: 'kickoff',
                possession: state.possession === 'home' ? 'away' : 'home'
            };
        }
    }, [homeTeam, awayTeam, addCommentary]);

    const twoPointConversion = useCallback((state: GameState): GameState => {
        const scoringTeam = state.possession === 'home' ? homeTeam : awayTeam;
        const offenseRating = scoringTeam?.offense || 80;
        const successRate = offenseRating / 200;
        if (Math.random() < successRate) {
            const newState: GameState = {
                ...state,
                homeScore: state.possession === 'home' ? state.homeScore + 2 : state.homeScore,
                awayScore: state.possession === 'away' ? state.awayScore + 2 : state.awayScore,
                playType: 'kickoff',
                possession: state.possession === 'home' ? 'away' : 'home'
            };
            addCommentary(`Two-point conversion is successful! ${scoringTeam?.name} adds two more to their score.`);
            return newState;
        } else {
            addCommentary("The two-point conversion attempt fails!");
            return {
                ...state,
                playType: 'kickoff',
                possession: state.possession === 'home' ? 'away' : 'home'
            };
        }
    }, [homeTeam, awayTeam, addCommentary]);

    const handleFourthDown = useCallback((state: GameState): GameState => {
        const currentTeam = state.possession === 'home' ? homeTeam : awayTeam;
        const fieldGoalRange = 65; // Close enough for a field goal attempt
        const shortYards = 4; // Close enough to attempt conversion

        if (state.fieldPosition > fieldGoalRange && state.yardsToGo <= shortYards) {
            // Field goal attempt if within range and short yards
            const specialTeamsRating = currentTeam?.specialTeams || 80;
            const successRate = specialTeamsRating / 100;

            if (Math.random() < successRate) {
                addCommentary(`${currentTeam?.name} successfully kicks a field goal!`);
                return {
                    ...state,
                    homeScore: state.possession === 'home' ? state.homeScore + 3 : state.awayScore + 3, // Add 3 points
                    playType: 'kickoff', // Successful field goal, so kickoff follows
                    possession: state.possession === 'home' ? 'away' : 'home', // Change possession
                    down: 1,
                    yardsToGo: 10,
                    fieldPosition: 35 // Receiving team starts at the 35-yard line after kickoff
                };
            } else {
                // Field goal fails, so it's a turnover
                addCommentary(`${currentTeam?.name}'s field goal attempt is no good! Turnover on downs.`);
                return {
                    ...state,
                    possession: state.possession === 'home' ? 'away' : 'home', // Turnover on downs
                    down: 1,
                    yardsToGo: 10,
                    fieldPosition: 100 - state.fieldPosition // Ball is turned over at the spot of the kick
                };
            }
        }

        // Punt if too far or field goal not attempted
        if (state.fieldPosition < fieldGoalRange || state.yardsToGo > shortYards) {
            const puntDistance = Math.floor(Math.random() * 20) + 40;
            const newFieldPosition = Math.max(20, Math.min(100 - state.fieldPosition - puntDistance, 80));
            addCommentary(`${currentTeam?.name} punts the ball. The receiving team starts at their own ${newFieldPosition}-yard line.`);
            return {
                ...state,
                fieldPosition: newFieldPosition,
                possession: state.possession === 'home' ? 'away' : 'home', // Change possession
                down: 1,
                yardsToGo: 10
            };
        }

        // Turnover if they fail to convert on 4th down
        addCommentary(`${currentTeam?.name} fails to convert on 4th down! Turnover on downs.`);
        return {
            ...state,
            possession: state.possession === 'home' ? 'away' : 'home', // Change possession
            down: 1,
            yardsToGo: 10,
            fieldPosition: 100 - state.fieldPosition // Ball is turned over at the spot of the turnover
        };
    }, [homeTeam, awayTeam, addCommentary]);

    const generateWeather = useCallback(() => {
        const conditions = ['Clear', 'Cloudy', 'Rainy', 'Windy', 'Snowy'];
        const newWeather = conditions[Math.floor(Math.random() * conditions.length)];
        setWeather(newWeather);
        addCommentary(`Weather update: It's ${newWeather.toLowerCase()} at the stadium.`);
    }, [addCommentary]);

    const updateCrowd = useCallback((state: GameState) => {
        const excitement = Math.abs(state.homeScore - state.awayScore) < 10 ? 20 : 10;
        const newCrowd = Math.min(100, Math.max(50, crowd + Math.floor(Math.random() * excitement) - 5));
        setCrowd(newCrowd);
        if (newCrowd > 90) addCommentary("The crowd is going wild!");
        else if (newCrowd < 60) addCommentary("The stadium has gotten eerily quiet.");
    }, [crowd, addCommentary]);

    const generateInjury = useCallback((team: 'home' | 'away') => {
        const player = getRandomPlayer();
        const injuryType = ['minor', 'serious'][Math.floor(Math.random() * 2)];
        setInjuries(prev => ({
            ...prev,
            [team]: [...prev[team], player]
        }));
        const teamName = team === 'home' ? homeTeam?.name : awayTeam?.name;
        addCommentary(`${teamName}'s ${player} has suffered a ${injuryType} injury and is being attended to by medical staff.`);
        setGameEvents(prev => [`${teamName}'s ${player} injured`, ...prev]);
    }, [getRandomPlayer, homeTeam, awayTeam, addCommentary]);

    const generatePenalty = useCallback((state: GameState): GameState => {
        const penaltyTeam = Math.random() < 0.5 ? 'home' : 'away';
        const penalties = ['Holding', 'Pass Interference', 'False Start', 'Offsides', 'Unnecessary Roughness'];
        const penalty = penalties[Math.floor(Math.random() * penalties.length)];
        const yards = penalty === 'Pass Interference' ? Math.min(state.yardsToGo, 15) : (penalty === 'Unnecessary Roughness' ? 15 : 5);

        const newState = {
            ...state,
            yardsToGo: state.yardsToGo + (penaltyTeam === state.possession ? yards : -yards),
            fieldPosition: state.fieldPosition + (penaltyTeam === state.possession ? -yards : yards),
            penalties: {
                ...state.penalties,
                [penaltyTeam]: state.penalties[penaltyTeam] + 1
            }
        };

        const teamName = penaltyTeam === 'home' ? homeTeam?.name : awayTeam?.name;
        addCommentary(`Flag on the play! ${penalty} called against ${teamName}. ${yards} yard penalty.`);
        setGameEvents(prev => [`${penalty} on ${teamName}`, ...prev]);

        return newState;
    }, [homeTeam, awayTeam, addCommentary]);

    const weightedRandomChoice = (options: string[], weights: number[]): string => {
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        const randomNum = Math.random() * totalWeight;
        let weightSum = 0;
        for (let i = 0; i < options.length; i++) {
            weightSum += weights[i];
            if (randomNum <= weightSum) {
                return options[i];
            }
        }
        return options[options.length - 1];
    };

    // Step 1: Define applyTimeoutLogic using useCallback
    const applyTimeoutLogic = useCallback((state: GameState): GameState => {
        const teamInPossession = state.possession === 'home' ? 'home' : 'away';
        const timeoutsLeft = state.timeoutsLeft[teamInPossession];

        if (
            timeoutsLeft > 0 &&
            state.quarter === 4 &&
            Math.abs(state.homeScore - state.awayScore) < 7 &&
            parseInt(state.timeLeft.split(':')[0]) < 2
        ) {
            const newTimeoutsLeft = { ...state.timeoutsLeft, [teamInPossession]: timeoutsLeft - 1 };
            addCommentary(`${teamInPossession === 'home' ? homeTeam?.name : awayTeam?.name} uses a timeout!`);

            return {
                ...state,
                timeoutsLeft: newTimeoutsLeft,
                timeLeft: "02:00", // Simulating the timeout stops the clock for 2 minutes
            };
        }
        return state;
    }, [homeTeam, awayTeam, addCommentary]); // Ensure dependencies are properly set

    // Step 2: Use applyTimeoutLogic in generatePlay
    const generatePlay = useCallback((state: GameState): GameState => {
        if (!homeTeam || !awayTeam) return state;

        // Apply timeouts logic using applyTimeoutLogic
        state = applyTimeoutLogic(state);

        // Handle special play types
        if (state.playType === "kickoff") return kickoff(state);
        if (state.playType === "extraPoint") return extraPoint(state);
        if (state.playType === "twoPointConversion") return twoPointConversion(state);

        const offenseTeam = state.possession === "home" ? homeTeam : awayTeam;
        const defenseTeam = state.possession === "home" ? awayTeam : homeTeam;

        // Define play options and select one
        const playOptions = ["run", "shortPass", "longPass", "sack"];
        const playWeights = [0.4, 0.3, 0.2, 0.1];
        const selectedPlay = weightedRandomChoice(playOptions, playWeights);

        let yards = 0;
        let turnover = false;
        let commentary = "";

        const offensivePlayer = getRandomPlayer();
        const defensivePlayer = getRandomPlayer();

        // Calculate play success based on offense and defense ratings
        const offenseRating = offenseTeam.offense;
        const defenseRating = defenseTeam.defense;
        const playSuccess = Math.random() * (offenseRating + defenseRating) < offenseRating;

        switch (selectedPlay) {
            case "run":
                yards = playSuccess ? Math.floor(Math.random() * 8) + 1 : Math.floor(Math.random() * 3) - 2;
                commentary = yards > 0
                    ? `${offenseTeam.name}'s ${offensivePlayer} rushes for a gain of ${yards} yards.`
                    : `${defenseTeam.name}'s defense stops ${offensivePlayer} for a loss of ${Math.abs(yards)} yards.`;
                break;
            case "shortPass":
                yards = playSuccess ? Math.floor(Math.random() * 12) + 3 : 0;
                turnover = !playSuccess && Math.random() < 0.1;
                commentary = yards > 0
                    ? `${offenseTeam.name}'s QB completes a short pass to ${offensivePlayer} for ${yards} yards.`
                    : `Incomplete pass by ${offenseTeam.name}'s QB, intended for ${offensivePlayer}.`;
                break;
            case "longPass":
                yards = playSuccess ? Math.floor(Math.random() * 30) + 15 : 0;
                turnover = !playSuccess && Math.random() < 0.15;
                commentary = yards > 0
                    ? `${offenseTeam.name}'s QB airs it out and connects with ${offensivePlayer} for a big gain of ${yards} yards!`
                    : `${offenseTeam.name}'s QB's deep pass, intended for ${offensivePlayer}, falls incomplete.`;
                break;
            case "sack":
                yards = -Math.floor(Math.random() * 8) - 1;
                turnover = Math.random() < 0.05;
                commentary = `Sack! ${defenseTeam.name}'s ${defensivePlayer} takes down the quarterback for a loss of ${Math.abs(yards)} yards.`;
                break;
        }

        if (turnover) {
            commentary += " But wait! There's a turnover!";
            setGameEvents(prev => [`Turnover by ${offenseTeam.name}`, ...prev]);
        }

        let newState = {
            ...state,
            fieldPosition: Math.min(Math.max(state.fieldPosition + yards, 0), 100),
            yardsToGo: Math.max(state.yardsToGo - yards, 0),
            down: turnover ? 1 : Math.min(state.down + 1, 4), // Ensure down never exceeds 4
            lastPlay: commentary,
            turnovers: {
                ...state.turnovers,
                [state.possession]: turnover
                    ? state.turnovers[state.possession] + 1
                    : state.turnovers[state.possession],
            },
        };

        if (turnover) {
            newState = {
                ...newState,
                possession: state.possession === "home" ? "away" : "home",
                down: 1,
                yardsToGo: 10,
                fieldPosition: 100 - newState.fieldPosition,
            };
        } else if (newState.yardsToGo <= 0) {
            newState = {
                ...newState,
                down: 1,
                yardsToGo: 10,
            };
            addCommentary(`${offenseTeam.name} gets a first down!`);
        } else if (newState.down === 4 && newState.yardsToGo > 0) {
            newState = handleFourthDown(newState);
        }

        // Touchdown scenario
        if (newState.fieldPosition >= 100) {
            commentary += ` Touchdown ${offenseTeam.name}!`;
            newState = {
                ...newState,
                homeScore: state.possession === "home" ? state.homeScore + 6 : state.homeScore,
                awayScore: state.possession === "away" ? state.awayScore + 6 : state.awayScore,
                playType: Math.random() < 0.95 ? "extraPoint" : "twoPointConversion",
                fieldPosition: 98, // Set up for extra point or two-point conversion
            };
            setGameEvents(prev => [`Touchdown by ${offenseTeam.name}`, ...prev]);
        }

        // Random events
        if (Math.random() < 0.05) generateInjury(state.possession);
        if (Math.random() < 0.1) newState = generatePenalty(newState);
        if (Math.random() < 0.02) generateWeather();
        updateCrowd(newState);

        addCommentary(commentary);
        return {
            ...newState,
            driveStatus: updateDriveStatus(newState),
        };
    }, [
        homeTeam,
        awayTeam,
        kickoff,
        extraPoint,
        twoPointConversion,
        getRandomPlayer,
        handleFourthDown,
        generateInjury,
        generatePenalty,
        generateWeather,
        updateCrowd,
        addCommentary,
        updateDriveStatus,
        applyTimeoutLogic // Include applyTimeoutLogic as a dependency
    ]);

    const determineWinner = useCallback(() => {
        if (gameState.homeScore > gameState.awayScore) {
            setWinner(homeTeam?.abbreviation || null);
            addCommentary(`${homeTeam?.name} clinch a thrilling victory!`);
        } else if (gameState.awayScore > gameState.homeScore) {
            setWinner(awayTeam?.abbreviation || null);
            addCommentary(`${awayTeam?.name} secure an impressive win on the road!`);
        } else {
            setWinner("TIE");
            addCommentary("An incredible game ends in a dramatic tie!");
        }
    }, [gameState.homeScore, gameState.awayScore, homeTeam, awayTeam, addCommentary]);

    useEffect(() => {
        setAnimated(true);
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (gameState.gameStatus === "Not Started" && homeTeam && awayTeam) {
            setGameState(prev => ({ ...prev, gameStatus: "Coin Toss" }));
            addCommentary(`Welcome to this exciting matchup between ${homeTeam.name} and ${awayTeam.name}!`);
            addCommentary(`I'm ${commentators[0]} joined by ${commentators[1]}. We're in for a treat today!`);
            coinToss();
        }

        if (gameState.gameStatus !== "In Progress") return;

        const gameTimer = setInterval(() => {
            setGameState(prevState => {
                const [minutes, seconds] = prevState.timeLeft.split(':').map(Number);
                if (minutes === 0 && seconds === 0) {
                    if (prevState.quarter < 4) {
                        addCommentary(`That's the end of Q${prevState.quarter}. The teams are heading to the sidelines for a quick break.`);
                        if (prevState.quarter === 2) {
                            addCommentary("It's halftime! Let's review the first half highlights...");
                        }
                        return {
                            ...prevState,
                            quarter: prevState.quarter + 1,
                            timeLeft: "15:00",
                            playType: 'kickoff'
                        };
                    } else {
                        clearInterval(gameTimer);
                        determineWinner();
                        return { ...prevState, gameStatus: "Finished", timeLeft: "00:00" };
                    }
                }
                const totalSeconds = minutes * 60 + seconds - 15;
                const newMinutes = Math.floor(totalSeconds / 60);
                const newSeconds = totalSeconds % 60;
                return {
                    ...generatePlay(prevState),
                    timeLeft: `${String(Math.max(0, newMinutes)).padStart(2, '0')}:${String(Math.max(0, newSeconds)).padStart(2, '0')}`
                };
            });
        }, 3000);

        return () => clearInterval(gameTimer);
    }, [gameState.gameStatus, homeTeam, awayTeam, commentators, coinToss, generatePlay, determineWinner, addCommentary]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

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

    return (
        <div className="w-full max-w-4xl bg-zinc-900 bg-opacity-80 rounded-2xl p-4 sm:p-6 shadow-2xl border border-zinc-700">
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

                {showCoinAnimation && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                        <div className="relative w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64">
                            <Image
                                src="/coin.png"
                                alt="Coin Toss"
                                fill
                                sizes="(max-width: 640px) 128px, (max-width: 768px) 192px, 256px"
                                className="object-contain animate-spin-slow"
                            />
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center w-full text-sm">
                    <div className="text-blue-400">
                        <Zap className="inline-block w-4 h-4 mr-1" />
                        Weather: {weather}
                    </div>
                    <div className="text-yellow-400">
                        <Users className="inline-block w-4 h-4 mr-1" />
                        Crowd Excitement: {crowd}%
                    </div>
                </div>

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
                            <span className="text-xs text-zinc-400 group relative">
                                TO: {gameState.timeoutsLeft.home}
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Timeouts remaining
                                </span>
                            </span>
                        </div>


                        <div className="text-zinc-100 flex items-center justify-center">
                            <div className="scoreboard text-center">
                                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-300 font-digital tracking-wider shadow-timer">
                                    {gameState.timeLeft}
                                </span>
                            </div>
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
                            <span className="text-xs text-zinc-400 group relative">
                                TO: {gameState.timeoutsLeft.away}
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    Timeouts remaining
                                </span>
                            </span>
                        </div>
                        <div className="text-red-500 text-center" style={isMounted ? { color: homeTeam?.color } : undefined}>
                            {gameState.homeScore}
                        </div>
                        <div className="text-yellow-500 text-base sm:text-xl md:text-2xl text-center">Q{gameState.quarter}</div>
                        <div className="text-orange-500 text-center" style={isMounted ? { color: awayTeam?.color } : undefined}>
                            {gameState.awayScore}
                        </div>
                    </div>
                    <div className="mt-2 sm:mt-4 text-xs sm:text-sm md:text-base font-semibold text-zinc-300 text-center">
                        {gameState.gameStatus === "In Progress" ? gameState.driveStatus : gameState.gameStatus}
                    </div>
                    <div className="mt-2 text-xs text-zinc-400 text-center">
                        Possession: {gameState.possession === 'home' ? homeTeam?.abbreviation : awayTeam?.abbreviation}
                    </div>
                    <div className="mt-2 text-xs text-zinc-400 flex justify-between">
                        <span>Penalties: {gameState.penalties.home} - {gameState.penalties.away}</span>
                        <span>Turnovers: {gameState.turnovers.home} - {gameState.turnovers.away}</span>
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
                    <div className="space-y-2 h-32 sm:h-40 md:h-48 overflow-y-auto text-xs sm:text-sm md:text-base">
                        {commentary.map((comment, index) => (
                            <p key={index} className="animate-fadeIn">{comment}</p>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 w-full p-3 sm:p-4 rounded-xl shadow-lg border border-zinc-700">
                    <div className="flex items-center mb-2">
                        <Activity className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-500" />
                        <span className="text-md sm:text-lg font-bold text-zinc-300">Game Events</span>
                    </div>
                    <div className="text-xs sm:text-sm text-zinc-300 h-20 sm:h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent">
                        {gameEvents.map((event, index) => (
                            <p key={index} className="leading-relaxed">{event}</p>
                        ))}
                    </div>
                </div>

                {(injuries.home.length > 0 || injuries.away.length > 0) && (
                    <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 w-full p-3 sm:p-4 rounded-xl shadow-lg border border-zinc-700">
                        <div className="flex items-center mb-2">
                            <Flag className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-red-500" />
                            <span className="text-md sm:text-lg font-bold text-zinc-300">Injuries</span>
                        </div>
                        <div className="text-xs sm:text-sm text-zinc-300">
                            <p>{homeTeam?.name}: {injuries.home.join(', ') || 'None'}</p>
                            <p>{awayTeam?.name}: {injuries.away.join(', ') || 'None'}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Simulation;
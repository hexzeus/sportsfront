import React, { useEffect, useCallback } from 'react';

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

interface GameLogicProps {
    gameState: GameState;
    homeTeam: Team | null;
    awayTeam: Team | null;
    updateGameState: (updater: (prevState: GameState) => GameState) => void;
    addCommentary: (message: string) => void;
    addEvent: (event: string) => void;
    updateInjuries: (team: 'home' | 'away', injury: string) => void;
    setWeather: (weather: string) => void;
    setCrowd: (crowd: number) => void;
    setShowCoinAnimation: (show: boolean) => void;
}

const GameLogic: React.FC<GameLogicProps> = ({
    gameState,
    homeTeam,
    awayTeam,
    updateGameState,
    addCommentary,
    addEvent,
    updateInjuries,
    setWeather,
    setCrowd,
    setShowCoinAnimation
}) => {
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
            const choice = Math.random() < 0.5 ? 'receive' : 'kick';
            const receivingTeam = choice === 'receive' ? winner : (winner === 'home' ? 'away' : 'home');
            updateGameState(prevState => ({
                ...prevState,
                possession: receivingTeam,
                playType: 'kickoff',
                gameStatus: "In Progress"
            }));
            setShowCoinAnimation(false);
            addCommentary(`${winner === 'home' ? homeTeam?.name : awayTeam?.name} wins the coin toss and elects to ${choice}!`);
        }, 1000);
    }, [homeTeam, awayTeam, updateGameState, addCommentary, setShowCoinAnimation]);

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
        const fieldGoalRange = 65;
        const shortYards = 4;

        if (state.fieldPosition > fieldGoalRange && state.yardsToGo <= shortYards) {
            const specialTeamsRating = currentTeam?.specialTeams || 80;
            const successRate = specialTeamsRating / 100;

            if (Math.random() < successRate) {
                addCommentary(`${currentTeam?.name} successfully kicks a field goal!`);
                return {
                    ...state,
                    homeScore: state.possession === 'home' ? state.homeScore + 3 : state.homeScore,
                    awayScore: state.possession === 'away' ? state.awayScore + 3 : state.awayScore,
                    playType: 'kickoff',
                    possession: state.possession === 'home' ? 'away' : 'home',
                    down: 1,
                    yardsToGo: 10,
                    fieldPosition: 35
                };
            } else {
                addCommentary(`${currentTeam?.name}'s field goal attempt is no good! Turnover on downs.`);
                return {
                    ...state,
                    possession: state.possession === 'home' ? 'away' : 'home',
                    down: 1,
                    yardsToGo: 10,
                    fieldPosition: 100 - state.fieldPosition
                };
            }
        }

        if (state.fieldPosition < fieldGoalRange || state.yardsToGo > shortYards) {
            const puntDistance = Math.floor(Math.random() * 20) + 40;
            const newFieldPosition = Math.max(20, Math.min(100 - state.fieldPosition - puntDistance, 80));
            addCommentary(`${currentTeam?.name} punts the ball. The receiving team starts at their own ${newFieldPosition}-yard line.`);
            return {
                ...state,
                fieldPosition: newFieldPosition,
                possession: state.possession === 'home' ? 'away' : 'home',
                down: 1,
                yardsToGo: 10
            };
        }

        addCommentary(`${currentTeam?.name} fails to convert on 4th down! Turnover on downs.`);
        return {
            ...state,
            possession: state.possession === 'home' ? 'away' : 'home',
            down: 1,
            yardsToGo: 10,
            fieldPosition: 100 - state.fieldPosition
        };
    }, [homeTeam, awayTeam, addCommentary]);

    const generateWeather = useCallback(() => {
        const conditions = ['Clear', 'Cloudy', 'Rainy', 'Windy', 'Snowy'];
        const newWeather = conditions[Math.floor(Math.random() * conditions.length)];
        setWeather(newWeather);
        addCommentary(`Weather update: It's ${newWeather.toLowerCase()} at the stadium.`);
    }, [setWeather, addCommentary]);

    // Hook to trigger weather change at the start of each quarter
    useEffect(() => {
        // Change weather at the start of the game (Quarter 1) and at the start of every new quarter
        if (gameState.quarter === 1 || gameState.quarter > 1) {
            generateWeather();
        }
    }, [gameState.quarter, generateWeather]);

    const updateCrowd = useCallback((state: GameState) => {
        // Higher excitement for close games and slight excitement increase for the home team winning
        const excitementFactor = Math.abs(state.homeScore - state.awayScore) <= 7 ? 20 : 10; // More excitement for close games
        let newCrowdExcitement = 50 + Math.random() * excitementFactor; // Base excitement around 50

        if (state.homeScore > state.awayScore) {
            newCrowdExcitement += 10; // Home team winning boosts excitement
        } else if (state.awayScore > state.homeScore) {
            newCrowdExcitement -= 10; // Away team leading decreases excitement
        }

        // Keep excitement within reasonable bounds (0 to 100)
        newCrowdExcitement = Math.min(Math.max(newCrowdExcitement, 0), 100);
        setCrowd(newCrowdExcitement);

        // Add commentary based on the crowd excitement level
        if (newCrowdExcitement > 90) {
            addCommentary("The crowd is going wild!");
        } else if (newCrowdExcitement < 60) {
            addCommentary("The stadium has gotten eerily quiet.");
        } else if (newCrowdExcitement >= 60 && newCrowdExcitement <= 90) {
            addCommentary("The crowd is on their feet, fully engaged in the game!");
        }
    }, [setCrowd, addCommentary]);

    const generateInjury = useCallback((team: 'home' | 'away') => {
        const player = getRandomPlayer();
        const injuryType = ['minor', 'serious'][Math.floor(Math.random() * 2)];
        updateInjuries(team, player);
        const teamName = team === 'home' ? homeTeam?.name : awayTeam?.name;
        addCommentary(`${teamName}'s ${player} has suffered a ${injuryType} injury and is being attended to by medical staff.`);
        addEvent(`${teamName}'s ${player} injured`);
    }, [getRandomPlayer, homeTeam, awayTeam, updateInjuries, addCommentary, addEvent]);

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
        addEvent(`${penalty} on ${teamName}`);

        return newState;
    }, [homeTeam, awayTeam, addCommentary, addEvent]);

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

    const generatePlay = useCallback((state: GameState): GameState => {
        if (!homeTeam || !awayTeam) return state;

        if (state.playType === "kickoff") return kickoff(state);
        if (state.playType === "extraPoint") return extraPoint(state);
        if (state.playType === "twoPointConversion") return twoPointConversion(state);

        const offenseTeam = state.possession === "home" ? homeTeam : awayTeam;
        const defenseTeam = state.possession === "home" ? awayTeam : homeTeam;

        const playOptions = ["run", "shortPass", "longPass", "sack"];
        const playWeights = [0.4, 0.3, 0.2, 0.1];
        const selectedPlay = weightedRandomChoice(playOptions, playWeights);

        let yards = 0;
        let turnover = false;
        let commentary = "";

        const offensivePlayer = getRandomPlayer();
        const defensivePlayer = getRandomPlayer();

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
            addEvent(`Turnover by ${offenseTeam.name}`);
        }

        let newState = {
            ...state,
            fieldPosition: Math.min(Math.max(state.fieldPosition + yards, 0), 100),
            yardsToGo: Math.max(state.yardsToGo - yards, 0),
            down: turnover ? 1 : Math.min(state.down + 1, 4),
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
            addEvent(`Touchdown by ${offenseTeam.name}`);
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
        addEvent,
        updateDriveStatus
    ]);

    const updateGameTimer = useCallback(() => {
        updateGameState(prevState => {
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
                    addCommentary("And that's the game! What an exciting match we've had today.");
                    return { ...prevState, gameStatus: "Finished", timeLeft: "00:00" };
                }
            }
            const totalSeconds = minutes * 60 + seconds - 15;
            const newMinutes = Math.floor(totalSeconds / 60);
            const newSeconds = totalSeconds % 60;
            return {
                ...generatePlay(prevState),
                timeLeft: `${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`
            };
        });
    }, [generatePlay, updateGameState, addCommentary]);

    useEffect(() => {
        if (gameState.gameStatus === "Not Started" && homeTeam && awayTeam) {
            addCommentary(`Welcome to this exciting matchup between ${homeTeam.name} and ${awayTeam.name}!`);
            coinToss();
        }

        if (gameState.gameStatus === "In Progress") {
            const gameTimer = setInterval(updateGameTimer, 3000);
            return () => clearInterval(gameTimer);
        }
    }, [gameState.gameStatus, homeTeam, awayTeam, coinToss, updateGameTimer, addCommentary]);

    return null; // This component doesn't render anything
};

export default GameLogic;
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
    // Enhanced getRandomPlayer with only positions and numbers
    const getRandomPlayer = useCallback((team: 'offense' | 'defense') => {
        const positions = {
            offense: ['QB', 'RB', 'WR', 'TE', 'OL'],
            defense: ['DL', 'LB', 'DB'],
            specialTeams: ['K', 'P']
        };

        const selectedPositions = team === 'offense'
            ? [...positions.offense, ...positions.specialTeams]
            : [...positions.defense, ...positions.specialTeams];

        const position = selectedPositions[Math.floor(Math.random() * selectedPositions.length)];

        // Assign numbers based on NFL rules
        let number;
        switch (position) {
            case 'QB':
            case 'K':
            case 'P':
                number = Math.floor(Math.random() * 19) + 1; // 1-19
                break;
            case 'RB':
            case 'DB':
                number = Math.floor(Math.random() * 30) + 20; // 20-49
                break;
            case 'WR':
                number = Math.random() < 0.5
                    ? Math.floor(Math.random() * 10) + 10  // 10-19
                    : Math.floor(Math.random() * 10) + 80; // 80-89
                break;
            case 'TE':
            case 'LB':
                {
                    const ranges = [
                        { min: 40, max: 49 },
                        { min: 50, max: 59 },
                        { min: 80, max: 89 }
                    ];
                    const selectedRange = ranges[Math.floor(Math.random() * ranges.length)];
                    number = Math.floor(Math.random() * (selectedRange.max - selectedRange.min + 1)) + selectedRange.min;
                }
                break;
            case 'OL':
                number = Math.floor(Math.random() * 30) + 50; // 50-79
                break;
            case 'DL':
                {
                    const ranges = [
                        { min: 50, max: 79 },
                        { min: 90, max: 99 }
                    ];
                    const selectedRange = ranges[Math.floor(Math.random() * ranges.length)];
                    number = Math.floor(Math.random() * (selectedRange.max - selectedRange.min + 1)) + selectedRange.min;
                }
                break;
            default:
                number = Math.floor(Math.random() * 99) + 1; // 1-99 (fallback)
        }

        return `#${number} ${position}`;
    }, []);

    // Enhanced updateDriveStatus with pro NFL commentary
    const updateDriveStatus = useCallback((state: GameState) => {
        const currentTeam = state.possession === 'home' ? homeTeam : awayTeam;
        const yardLine = state.fieldPosition > 50 ? 100 - state.fieldPosition : state.fieldPosition;
        const side = state.fieldPosition > 50 ? "opponent's" : "own";
        const down = `${state.down}${['st', 'nd', 'rd'][state.down - 1] || 'th'}`;
        const driveStr = `${currentTeam?.name} ${down} & ${state.yardsToGo} at ${side} ${yardLine}`;

        // Add more varied and exciting commentary
        if (yardLine <= 20) {
            addCommentary(`${currentTeam?.name} is in the red zone! The pressure is on to convert this opportunity into points.`);
        }

        if (yardLine <= 10) {
            addCommentary(`${currentTeam?.name} is knocking on the door! First and goal from the ${yardLine}.`);
        }

        if (state.yardsToGo <= 1) {
            addCommentary(`It's ${down} and inches for ${currentTeam?.name}. This is a crucial play that could swing the momentum.`);
        } else if (state.down === 3 && state.yardsToGo > 7) {
            addCommentary(`${currentTeam?.name} faces a challenging ${down} and long. The defense will be looking to force a punt here.`);
        }

        if (state.down === 4) {
            if (state.fieldPosition > 65 && state.yardsToGo <= 3) {
                addCommentary(`${currentTeam?.name} is in no man's land. Will they go for it or attempt a long field goal?`);
            } else if (state.fieldPosition <= 40) {
                addCommentary(`${currentTeam?.name} is likely to punt here, but don't rule out a surprise play.`);
            }
        }

        // Add time-based commentary
        const [minutes, seconds] = state.timeLeft.split(':').map(Number);
        if (state.quarter === 2 && minutes < 2) {
            addCommentary(`Two-minute warning approaching. ${currentTeam?.name} needs to manage the clock wisely.`);
        } else if (state.quarter === 4 && minutes < 5) {
            addCommentary(`We're in crunch time now. Every play could be the difference between victory and defeat.`);
        }

        return driveStr;
    }, [homeTeam, awayTeam, addCommentary]);


    const coinToss = useCallback(() => {
        setShowCoinAnimation(true);
        setTimeout(() => {
            const winner = Math.random() < 0.5 ? 'home' : 'away';
            const choice = Math.random() < 0.5 ? 'receive' : 'kick';
            const receivingTeam = choice === 'receive' ? winner : (winner === 'home' ? 'away' : 'home');
            const kickingTeam = receivingTeam === 'home' ? 'away' : 'home';

            updateGameState(prevState => ({
                ...prevState,
                possession: receivingTeam,
                playType: 'kickoff',
                gameStatus: "In Progress"
            }));

            // Added Commentary
            const tossWinnerTeam = winner === 'home' ? homeTeam?.name : awayTeam?.name;
            const receiveTeamName = receivingTeam === 'home' ? homeTeam?.name : awayTeam?.name;
            const kickTeamName = kickingTeam === 'home' ? homeTeam?.name : awayTeam?.name;

            addCommentary(`${tossWinnerTeam} wins the coin toss and chooses to ${choice === 'receive' ? 'receive the ball' : 'kick off'}!`);
            addCommentary(`${receiveTeamName} will receive the opening kickoff. ${kickTeamName} will kick off to start the game.`);

            setShowCoinAnimation(false);
        }, 1000); // Slightly longer timeout for more suspense
    }, [homeTeam, awayTeam, updateGameState, addCommentary, setShowCoinAnimation]);

    const kickoff = useCallback((state: GameState): GameState => {
        const kickingTeam = state.possession === 'home' ? awayTeam : homeTeam;
        const receivingTeam = state.possession === 'home' ? homeTeam : awayTeam;
        const kicker = getRandomPlayer('offense').replace(/[#()]|QB|RB|WR|TE|OT|OG|C/g, 'K');
        const returner = getRandomPlayer('offense').replace(/[#()]|QB|OT|OG|C/g, 'KR');

        const kickDistance = Math.floor(Math.random() * 10) + 65; // Kicks typically travel 65-75 yards
        const isTouchback = kickDistance >= 75 || Math.random() < 0.4; // Touchback probability

        let returnDistance = 0;
        let newFieldPosition = 25; // Default touchback position
        let commentary = `${kickingTeam?.name}'s ${kicker} kicks off`;

        if (!isTouchback) {
            returnDistance = Math.floor(Math.random() * 30); // Return between 0 to 30 yards
            newFieldPosition = Math.min(Math.max(100 - kickDistance + returnDistance, 1), 50); // Ensure realistic field position
            commentary += ` ${kickDistance} yards to the ${returnDistance === 0 ? 'end zone' : receivingTeam?.name + "'s " + (100 - kickDistance) + ' yard line'}.`;
            commentary += ` ${receivingTeam?.name}'s ${returner} returns it ${returnDistance} yards.`;
        } else {
            commentary += ` deep into the end zone. ${receivingTeam?.name}'s ${returner} takes a knee. Touchback.`;
        }

        const newState: GameState = {
            ...state,
            fieldPosition: newFieldPosition,
            down: 1,
            yardsToGo: 10,
            possession: state.possession === 'home' ? 'away' : 'home',
            playType: 'normal'
        };

        addCommentary(commentary);
        addEvent(`Kickoff: ${kickingTeam?.name} to ${receivingTeam?.name}. ${isTouchback ? 'Touchback' : 'Returned to the ' + newFieldPosition + ' yard line.'}`);

        return newState;
    }, [homeTeam, awayTeam, getRandomPlayer, addCommentary, addEvent]);

    // Example usage in extraPoint function
    const extraPoint = useCallback((state: GameState): GameState => {
        const scoringTeam = state.possession === "home" ? homeTeam : awayTeam;
        const kicker = getRandomPlayer('offense');
        const specialTeamsRating = scoringTeam?.specialTeams || 80;
        const successRate = (specialTeamsRating / 100) * 0.95; // NFL extra point success rate is around 95%
        const kickSuccess = Math.random() < successRate;

        let commentary = `${scoringTeam?.name}'s ${kicker} lines up for the extra point...`;

        const newState: GameState = {
            ...state,
            homeScore: state.possession === 'home' ? state.homeScore + (kickSuccess ? 1 : 0) : state.homeScore,
            awayScore: state.possession === 'away' ? state.awayScore + (kickSuccess ? 1 : 0) : state.awayScore,
            playType: 'kickoff',
            possession: state.possession === 'home' ? 'away' : 'home',
        };

        if (kickSuccess) {
            commentary += " The kick is up and it's good! Extra point is successful.";
        } else {
            const missType = Math.random() < 0.5 ? "wide right" : "wide left";
            commentary += ` The kick is ${missType}! Extra point is no good.`;
        }

        addCommentary(commentary);
        addEvent(`Extra point attempt by ${scoringTeam?.name}: ${kickSuccess ? 'Successful' : 'Missed'}`);

        return newState;
    }, [homeTeam, awayTeam, getRandomPlayer, addCommentary, addEvent]);

    const twoPointConversion = useCallback((state: GameState): GameState => {
        const scoringTeam = state.possession === "home" ? homeTeam : awayTeam;
        const defendingTeam = state.possession === "home" ? awayTeam : homeTeam;
        const offenseRating = scoringTeam?.offense || 80;
        const defenseRating = defendingTeam?.defense || 80;
        const successRate = (offenseRating / (offenseRating + defenseRating)) * 0.5; // NFL 2-point conversion success rate is around 50%
        const conversionSuccess = Math.random() < successRate;

        const playTypes = ['run', 'short pass', 'play action pass'];
        const selectedPlay = playTypes[Math.floor(Math.random() * playTypes.length)];
        const offensivePlayer = getRandomPlayer('offense');

        let commentary = `${scoringTeam?.name} is going for two! They line up in a ${selectedPlay} formation...`;

        const newState: GameState = {
            ...state,
            homeScore: state.possession === 'home' ? state.homeScore + (conversionSuccess ? 2 : 0) : state.homeScore,
            awayScore: state.possession === 'away' ? state.awayScore + (conversionSuccess ? 2 : 0) : state.awayScore,
            playType: 'kickoff',
            possession: state.possession === 'home' ? 'away' : 'home',
        };

        if (conversionSuccess) {
            commentary += ` The ${selectedPlay} is successful! ${offensivePlayer} finds the end zone. Two-point conversion is good!`;
        } else {
            commentary += ` The defense holds strong! ${defendingTeam?.name} stops the ${selectedPlay} attempt short of the goal line.`;
        }

        addCommentary(commentary);
        addEvent(`Two-point conversion attempt by ${scoringTeam?.name}: ${conversionSuccess ? 'Successful' : 'Failed'}`);

        return newState;
    }, [homeTeam, awayTeam, getRandomPlayer, addCommentary, addEvent]);


    const handleFourthDown = useCallback((state: GameState): GameState => {
        const currentTeam = state.possession === 'home' ? homeTeam : awayTeam;
        const fieldGoalRange = 63; // Realistic maximum field goal range
        const shortYards = 2;
        const mediumYards = 5;

        const timeRemaining = parseInt(state.timeLeft.split(':')[0]) * 60 + parseInt(state.timeLeft.split(':')[1]);
        const scoreDifference = state.possession === 'home' ? state.homeScore - state.awayScore : state.awayScore - state.homeScore;

        // Enhanced decision-making process
        const makeDecision = () => {
            if (state.fieldPosition >= 60 && state.fieldPosition < fieldGoalRange) {
                return Math.random() < 0.9 ? 'fieldGoal' : 'goForIt';
            }
            if (state.yardsToGo <= shortYards && state.fieldPosition > 45) {
                return Math.random() < 0.7 ? 'goForIt' : 'punt';
            }
            if (scoreDifference < 0 && timeRemaining < 300) {
                return Math.random() < 0.8 ? 'goForIt' : 'fieldGoal';
            }
            if (state.fieldPosition < 40 && state.yardsToGo > mediumYards) {
                return 'punt';
            }
            return Math.random() < 0.1 ? 'goForIt' : 'punt';
        };

        const decision = makeDecision();

        switch (decision) {
            case 'fieldGoal':
                const fieldGoalDistance = 100 - state.fieldPosition + 17; // Add 17 for end zone and snap
                const specialTeamsRating = currentTeam?.specialTeams || 80;
                const successRate = Math.max((specialTeamsRating / 100) - (fieldGoalDistance - 20) * 0.01, 0.1);
                const fieldGoalSuccess = Math.random() < successRate;

                addCommentary(`${currentTeam?.name} is sending out the field goal unit for a ${fieldGoalDistance}-yard attempt.`);

                if (fieldGoalSuccess) {
                    addCommentary(`The kick is up... and it's GOOD! ${currentTeam?.name} adds three points to the board!`);
                    return {
                        ...state,
                        homeScore: state.possession === 'home' ? state.homeScore + 3 : state.homeScore,
                        awayScore: state.possession === 'away' ? state.awayScore + 3 : state.awayScore,
                        playType: 'kickoff',
                        possession: state.possession === 'home' ? 'away' : 'home',
                        down: 1,
                        yardsToGo: 10,
                        fieldPosition: 35, // Reset for kickoff
                    };
                } else {
                    addCommentary(`The kick is up... but it's wide! No good from ${fieldGoalDistance} yards.`);
                    return {
                        ...state,
                        playType: 'normal',
                        possession: state.possession === 'home' ? 'away' : 'home',
                        down: 1,
                        yardsToGo: 10,
                        fieldPosition: 100 - state.fieldPosition,
                    };
                }

            case 'punt':
                const puntDistance = Math.floor(Math.random() * 20) + 35; // 35-55 yard punt
                const newFieldPosition = Math.max(20, Math.min(100 - state.fieldPosition - puntDistance, 80));
                const returnDistance = Math.floor(Math.random() * 15);
                const finalPosition = Math.max(1, newFieldPosition - returnDistance);

                addCommentary(`${currentTeam?.name} brings out the punting unit. The punt travels ${puntDistance} yards.`);
                if (returnDistance > 0) {
                    addCommentary(`The return man brings it back ${returnDistance} yards.`);
                }

                return {
                    ...state,
                    playType: 'normal',
                    fieldPosition: finalPosition,
                    possession: state.possession === 'home' ? 'away' : 'home',
                    down: 1,
                    yardsToGo: 10,
                };

            case 'goForIt':
                addCommentary(`${currentTeam?.name} is keeping the offense on the field! They're going for it on 4th and ${state.yardsToGo}!`);
                const conversionSuccess = Math.random() < 0.45; // NFL 4th down conversion rate is around 45%

                if (conversionSuccess) {
                    const yardsGained = Math.floor(Math.random() * 10) + state.yardsToGo;
                    addCommentary(`They convert! Gain of ${yardsGained} yards and a fresh set of downs.`);
                    return {
                        ...state,
                        fieldPosition: Math.min(state.fieldPosition + yardsGained, 100),
                        down: 1,
                        yardsToGo: 10,
                    };
                } else {
                    addCommentary(`The defense holds! Turnover on downs.`);
                    return {
                        ...state,
                        playType: 'normal',
                        possession: state.possession === 'home' ? 'away' : 'home',
                        down: 1,
                        yardsToGo: 10,
                        fieldPosition: 100 - state.fieldPosition,
                    };
                }

            default:
                return state;
        }
    }, [homeTeam, awayTeam, addCommentary]);

    const generateWeather = useCallback(() => {
        const conditions = [
            { type: 'Clear', description: 'perfect conditions', commentary: "It's a beautiful day for football! Clear skies and perfect visibility." },
            { type: 'Partly Cloudy', description: 'comfortable playing conditions', commentary: "Some clouds in the sky, but overall great conditions for today's game." },
            { type: 'Overcast', description: 'grey skies', commentary: "The sky is overcast, creating a dramatic backdrop for today's matchup." },
            { type: 'Light Rain', description: 'a slight drizzle', commentary: "A light rain is falling. The ball might get a bit slippery, but nothing these pros can't handle." },
            { type: 'Heavy Rain', description: 'pouring rain', commentary: "It's really coming down out there! Expect a lot of running plays and potential turnovers in these wet conditions." },
            { type: 'Windy', description: 'gusty conditions', commentary: "The wind is whipping through the stadium. Kickers and quarterbacks will need to adjust their game." },
            { type: 'Snow', description: 'winter wonderland', commentary: "Snow is falling! We're in for a classic cold-weather football game. Footing could be an issue." },
            { type: 'Fog', description: 'reduced visibility', commentary: "A thick fog has rolled in. Visibility is limited, which could lead to some interesting plays." },
            { type: 'Hot', description: 'scorching heat', commentary: "It's a scorcher today! The heat will definitely be a factor, especially in the later quarters." },
            { type: 'Cold', description: 'frigid temperatures', commentary: "Brrr! It's freezing out there. Players will need to stay active to keep warm in these conditions." }
        ];

        const selectedCondition = conditions[Math.floor(Math.random() * conditions.length)];
        const { type: newWeather, description, commentary } = selectedCondition;

        setWeather(newWeather);

        addCommentary(`Weather update: We're seeing ${description} here at the stadium.`);
        addCommentary(commentary);

        // Add some additional commentary based on the weather type
        switch (newWeather) {
            case 'Heavy Rain':
            case 'Snow':
                addCommentary("Ball security will be crucial in these conditions. We might see more conservative play-calling from both teams.");
                break;
            case 'Windy':
                addCommentary("The wind could play havoc with the passing and kicking game. Field position might be more important than ever.");
                break;
            case 'Fog':
                addCommentary("The reduced visibility might lead to some miscommunications. Both quarterbacks will need to be extra careful with their throws.");
                break;
            case 'Hot':
                addCommentary("Hydration and player rotation will be key in this heat. The team with better conditioning might have an edge in the fourth quarter.");
                break;
            case 'Cold':
                addCommentary("In this cold, we might see more running plays and shorter passes. It's tough to grip the ball when it's this chilly.");
                break;
        }

    }, [setWeather, addCommentary]);

    // Hook to trigger weather change at the start of each quarter
    useEffect(() => {
        if (gameState.quarter === 1) {
            generateWeather(); // Initial weather for the game
        } else if (gameState.quarter > 1 && Math.random() < 0.3) { // 30% chance of weather change each quarter
            addCommentary("Looks like the weather is changing as we start the new quarter.");
            generateWeather();
        }
    }, [gameState.quarter, generateWeather, addCommentary]);

    const updateCrowd = useCallback((state: GameState) => {
        // Higher excitement for close games and bigger spikes for major moments (like touchdowns)
        const excitementFactor = Math.abs(state.homeScore - state.awayScore) <= 7 ? 25 : 10; // More excitement for close games
        let newCrowdExcitement = 50 + Math.random() * excitementFactor; // Base excitement around 50

        // Boost excitement for home team success, decrease for away team success
        if (state.homeScore > state.awayScore) {
            newCrowdExcitement += 15; // Home team winning boosts excitement significantly
        } else if (state.awayScore > state.homeScore) {
            newCrowdExcitement -= 10; // Away team leading decreases excitement
        }

        // Adjust crowd excitement based on key game moments
        if (state.lastPlay.includes('Touchdown')) {
            newCrowdExcitement = state.possession === 'home' ? 100 : Math.max(newCrowdExcitement, 30); // Max excitement for home team touchdown
        } else if (state.lastPlay.includes('Interception') || state.lastPlay.includes('Fumble')) {
            newCrowdExcitement = 90; // Big turnover creates high excitement
        }

        // Keep excitement within reasonable bounds (0 to 100)
        newCrowdExcitement = Math.min(Math.max(newCrowdExcitement, 0), 100);
        setCrowd(newCrowdExcitement);

        // Add dynamic and pro-style commentary based on crowd excitement
        if (newCrowdExcitement > 90) {
            addCommentary("The crowd is absolutely electric! You can feel the energy pulsating through the stadium!");
        } else if (newCrowdExcitement > 75 && newCrowdExcitement <= 90) {
            addCommentary("The fans are on their feet, roaring with excitement! This game is heating up!");
        } else if (newCrowdExcitement > 60 && newCrowdExcitement <= 75) {
            addCommentary("The crowd is buzzing with anticipation, fully locked into the action!");
        } else if (newCrowdExcitement >= 30 && newCrowdExcitement <= 60) {
            addCommentary("The stadium atmosphere is steady, with fans closely following each play.");
        } else if (newCrowdExcitement < 30) {
            addCommentary("It's eerily quiet... You can hear a pin drop as the fans look on in shock.");
        }
    }, [setCrowd, addCommentary]);

    const generateInjury = useCallback((team: 'home' | 'away') => {
        const player = getRandomPlayer(team === 'home' ? 'offense' : 'defense');

        // Injury types and recovery times
        const injuryTypes = [
            { type: 'minor', description: 'ankle sprain', recoveryTime: 'few plays' },
            { type: 'minor', description: 'cramping', recoveryTime: 'few plays' },
            { type: 'moderate', description: 'hamstring strain', recoveryTime: 'quarter or more' },
            { type: 'moderate', description: 'concussion protocol', recoveryTime: 'rest of the game' },
            { type: 'serious', description: 'knee injury', recoveryTime: 'rest of the game' },
            { type: 'serious', description: 'shoulder dislocation', recoveryTime: 'rest of the game' }
        ];

        // Randomly choose injury severity and type
        const injury = injuryTypes[Math.floor(Math.random() * injuryTypes.length)];

        // Update the injury status
        updateInjuries(team, player);

        // Get team name for commentary
        const teamName = team === 'home' ? homeTeam?.name : awayTeam?.name;

        // Expert NFL-style commentary
        let commentary = `We have an injury on the field. ${teamName}'s ${player} is down and the medical staff is rushing out.`;

        if (injury.type === 'minor') {
            commentary += ` It looks like a ${injury.description}. The training staff is working on ${player}, and we expect them back in the game after a ${injury.recoveryTime}.`;
        } else if (injury.type === 'moderate') {
            commentary += ` This could be serious. It appears to be a ${injury.description}. ${player} is being helped off the field and might be out for a ${injury.recoveryTime}.`;
        } else {
            commentary += ` This doesn't look good, folks. The medical team is very concerned about a possible ${injury.description}. It's likely that ${player} will be out for the ${injury.recoveryTime}.`;
        }

        // Add injury event and commentary
        addCommentary(commentary);
        addEvent(`${teamName}'s ${player} injured: ${injury.description}, out for ${injury.recoveryTime}`);

        // Optional: Add a visual or sound cue for the injury
    }, [getRandomPlayer, homeTeam, awayTeam, updateInjuries, addCommentary, addEvent]);

    const generatePenalty = useCallback((state: GameState): GameState => {
        const penaltyTeam = Math.random() < 0.5 ? 'home' : 'away';
        const penalties = [
            { name: 'Holding', yards: 10, offense: true, repeatDown: false },
            { name: 'Pass Interference', yards: Math.min(state.yardsToGo, 15), offense: false, autoFirstDown: true },
            { name: 'False Start', yards: 5, offense: true, repeatDown: true },
            { name: 'Offsides', yards: 5, offense: false, repeatDown: true },
            { name: 'Unnecessary Roughness', yards: 15, offense: false, autoFirstDown: true },
            { name: 'Face Mask', yards: 15, offense: false, autoFirstDown: true },
            { name: 'Delay of Game', yards: 5, offense: true, repeatDown: true },
        ];

        const penalty = penalties[Math.floor(Math.random() * penalties.length)];
        const isOffensivePenalty = penaltyTeam === state.possession;

        // Adjust yardage and field position
        const yards = penalty.yards;
        const newFieldPosition = state.fieldPosition + (isOffensivePenalty ? -yards : yards);

        let newYardsToGo = state.yardsToGo + (isOffensivePenalty ? yards : -yards);
        let newDown = state.down;
        let autoFirstDown = false;

        // Check if the penalty results in an automatic first down
        if (penalty.autoFirstDown && !isOffensivePenalty) {
            newYardsToGo = 10;
            newDown = 1;
            autoFirstDown = true;
        }

        // If penalty is on offense and the play repeats the down
        if (penalty.repeatDown) {
            newDown = state.down;
        } else if (!isOffensivePenalty) {
            // Defensive penalties give the offense another chance unless it's a major penalty (Pass Interference, etc.)
            newDown = autoFirstDown ? 1 : Math.min(newDown, 4);
        }

        // Update state with penalty details
        const newState = {
            ...state,
            fieldPosition: Math.max(Math.min(newFieldPosition, 100), 0),
            yardsToGo: newYardsToGo,
            down: newDown,
            penalties: {
                ...state.penalties,
                [penaltyTeam]: state.penalties[penaltyTeam] + 1
            }
        };

        const teamName = penaltyTeam === 'home' ? homeTeam?.name : awayTeam?.name;
        const penaltyType = isOffensivePenalty ? "offensive" : "defensive";
        let commentary = `Flag on the play! ${penalty.name} (${penaltyType} penalty) called against ${teamName}.`;

        // Add specific commentary for automatic first downs
        if (autoFirstDown) {
            commentary += ` This results in an automatic first down!`;
        } else if (penalty.repeatDown) {
            commentary += ` The down will be repeated.`;
        }

        // Add yardage to the commentary
        commentary += ` ${yards} yard penalty.`;

        // Add event and commentary to the game
        addEvent(`${penalty.name} on ${teamName}`);
        addCommentary(commentary);

        return newState;
    }, [homeTeam, awayTeam, addCommentary, addEvent]);

    const weightedRandomChoice = (
        options: string[],
        weights: number[],
        down: number,
        yardsToGo: number,
        fieldPosition: number,
        timeLeft: string,
        offenseRating: number,
        defenseRating: number
    ): string => {
        let adjustedWeights = weights.map((weight, index) => {
            let adjustedWeight = weight;

            // Favor passing plays on long downs (3rd and 4th downs with long yardage)
            if ((options[index] === 'shortPass' || options[index] === 'longPass') && down >= 3 && yardsToGo >= 7) {
                adjustedWeight *= 1.5;
            }

            // Favor running plays in short-yardage situations (2 yards or less)
            if (options[index] === 'run' && (yardsToGo <= 2 || fieldPosition <= 20)) {
                adjustedWeight *= 1.8;
            }

            // Increase chance of sacks if defense is strong or offense is backed up
            if (options[index] === 'sack' && (defenseRating > offenseRating || fieldPosition <= 10)) {
                adjustedWeight *= 1.3;
            }

            // Increase chances of turnovers (fumble/interception) in risky or clutch situations
            if (options[index] === 'fumble' || options[index] === 'interception') {
                if (timeLeft.startsWith('00:') || fieldPosition <= 30) {
                    adjustedWeight *= 2;
                }
            }

            return adjustedWeight;
        });

        // Calculate total weight after adjustments
        const totalWeight = adjustedWeights.reduce((a, b) => a + b, 0);
        const randomNum = Math.random() * totalWeight;

        // Weighted selection
        let weightSum = 0;
        for (let i = 0; i < options.length; i++) {
            weightSum += adjustedWeights[i];
            if (randomNum <= weightSum) {
                return options[i];
            }
        }
        return options[options.length - 1]; // Fallback
    };

    // Add this new function to handle timeout usage
    const useTimeout = useCallback((state: GameState, team: 'home' | 'away'): GameState => {
        if (state.timeoutsLeft[team] > 0) {
            const newTimeoutsLeft = {
                ...state.timeoutsLeft,
                [team]: state.timeoutsLeft[team] - 1
            };

            const teamName = team === 'home' ? homeTeam?.name : awayTeam?.name;
            addCommentary(`${teamName} calls a timeout. They have ${newTimeoutsLeft[team]} timeouts remaining.`);

            return {
                ...state,
                timeoutsLeft: newTimeoutsLeft
            };
        } else {
            addCommentary(`${team === 'home' ? homeTeam?.name : awayTeam?.name} wanted to call a timeout, but they have none left!`);
            return state;
        }
    }, [homeTeam, awayTeam, addCommentary]);

    const generatePlay = useCallback((state: GameState): GameState => {
        if (!homeTeam || !awayTeam) return state;

        // Handle special play types
        if (state.playType === "kickoff") return kickoff(state);
        if (state.playType === "extraPoint") return extraPoint(state);
        if (state.playType === "twoPointConversion") return twoPointConversion(state);

        const offenseTeam = state.possession === "home" ? homeTeam : awayTeam;
        const defenseTeam = state.possession === "home" ? awayTeam : homeTeam;

        // Check for potential timeout usage before the play
        const shouldUseTimeout = (team: 'home' | 'away') => {
            const [minutes, seconds] = state.timeLeft.split(':').map(Number);
            const timeRemaining = minutes * 60 + seconds;
            const losing = (team === 'home' && state.homeScore < state.awayScore) ||
                (team === 'away' && state.awayScore < state.homeScore);
            const closeGame = Math.abs(state.homeScore - state.awayScore) <= 8;
            const criticalTime = state.quarter === 4 && timeRemaining < 120; // Last 2 minutes
            return losing && closeGame && criticalTime && state.timeoutsLeft[team] > 0;
        };

        if (shouldUseTimeout(state.possession === 'home' ? 'away' : 'home')) {
            const timeoutTeam = state.possession === 'home' ? 'away' : 'home';
            state = useTimeout(state, timeoutTeam);
            addCommentary(`${timeoutTeam === 'home' ? homeTeam.name : awayTeam.name} calls a timeout to stop the clock!`);
        }

        // Dynamic play options and weights
        const playOptions = ["run", "shortPass", "longPass", "screenPass"];
        let playWeights = [0.4, 0.3, 0.2, 0.1];

        // Adjust play weights based on game situation
        const [minutes, seconds] = state.timeLeft.split(':').map(Number);
        const timeRemaining = minutes * 60 + seconds;
        if (state.quarter === 4 && timeRemaining < 120 && Math.abs(state.homeScore - state.awayScore) <= 8) {
            // More passing in close games near the end
            playWeights = [0.2, 0.4, 0.3, 0.1];
        } else if (state.yardsToGo <= 3) {
            // More running on short yardage situations
            playWeights = [0.6, 0.2, 0.1, 0.1];
        }

        const selectedPlay = weightedRandomChoice(
            playOptions, playWeights,
            state.down, state.yardsToGo, state.fieldPosition,
            state.timeLeft, offenseTeam.offense, defenseTeam.defense
        );

        let yards = 0;
        let turnover = false;
        let commentary = "";
        let clockStops = false;

        const offensivePlayer = getRandomPlayer('offense');
        const defensivePlayer = getRandomPlayer('defense');

        const playSuccess = Math.random() < (offenseTeam.offense / (offenseTeam.offense + defenseTeam.defense));

        // Play execution
        switch (selectedPlay) {
            case "run":
                yards = playSuccess ? Math.floor(Math.random() * 8) + 1 : Math.floor(Math.random() * 3) - 1;
                commentary = playSuccess
                    ? `${offenseTeam.name}'s ${offensivePlayer} finds a gap and gains ${yards} yards.`
                    : `${defenseTeam.name}'s defense stops ${offensivePlayer} for ${yards < 0 ? 'a loss of ' + Math.abs(yards) : 'no gain'}.`;
                break;

            case "shortPass":
                yards = playSuccess ? Math.floor(Math.random() * 12) + 3 : 0;
                clockStops = !playSuccess;
                commentary = playSuccess
                    ? `${offenseTeam.name}'s QB completes a pass to ${offensivePlayer} for a gain of ${yards} yards.`
                    : `The pass falls incomplete, intended for ${offensivePlayer}.`;
                break;

            case "longPass":
                yards = playSuccess ? Math.floor(Math.random() * 30) + 15 : 0;
                clockStops = !playSuccess;
                turnover = !playSuccess && Math.random() < 0.15;
                commentary = playSuccess
                    ? `${offenseTeam.name}'s QB launches a deep ball and connects with ${offensivePlayer} for a ${yards}-yard gain!`
                    : `The deep pass intended for ${offensivePlayer} falls incomplete.`;
                if (turnover) commentary += ` Intercepted by ${defensivePlayer} of ${defenseTeam.name}!`;
                break;

            case "screenPass":
                yards = playSuccess ? Math.floor(Math.random() * 15) + 1 : Math.floor(Math.random() * 3) - 2;
                commentary = playSuccess
                    ? `Screen pass to ${offensivePlayer} gains ${yards} yards.`
                    : `Screen pass to ${offensivePlayer} is sniffed out by the defense for ${yards < 0 ? 'a loss of ' + Math.abs(yards) : 'no gain'}.`;
                break;
        }

        // Update field position
        let newFieldPosition = Math.min(Math.max(state.fieldPosition + yards, 0), 100);

        // Handle turnovers
        if (turnover) {
            commentary += ` Turnover! ${defenseTeam.name} takes over on offense.`;
            newFieldPosition = 100 - newFieldPosition;
            addEvent(`Turnover by ${offenseTeam.name}`);
        }

        // Update game state
        let newState: GameState = {
            ...state,
            fieldPosition: newFieldPosition,
            yardsToGo: Math.max(state.yardsToGo - yards, 0),
            down: turnover ? 1 : Math.min(state.down + 1, 4),
            lastPlay: commentary,
            turnovers: {
                ...state.turnovers,
                [state.possession]: turnover ? state.turnovers[state.possession] + 1 : state.turnovers[state.possession],
            },
        };

        // First down logic
        if (newState.yardsToGo <= 0) {
            newState = { ...newState, down: 1, yardsToGo: 10 };
            addCommentary(`${offenseTeam.name} picks up a first down!`);
        }

        // Fourth down logic
        if (newState.down === 4 && newState.yardsToGo > 0) {
            newState = handleFourthDown(newState);
        }

        // Touchdown logic
        if (newState.fieldPosition >= 100) {
            commentary += ` Touchdown ${offenseTeam.name}! ${offensivePlayer} scores!`;
            newState = {
                ...newState,
                homeScore: state.possession === "home" ? newState.homeScore + 6 : newState.homeScore,
                awayScore: state.possession === "away" ? newState.awayScore + 6 : newState.awayScore,
                playType: Math.random() < 0.98 ? "extraPoint" : "twoPointConversion",
                fieldPosition: 98,
            };
            addEvent(`Touchdown by ${offenseTeam.name} - ${offensivePlayer}`);
        }

        // Handle clock management
        if (!clockStops && newState.playType === 'normal') {
            const [currentMinutes, currentSeconds] = newState.timeLeft.split(':').map(Number);
            let newSeconds = currentSeconds - 40; // Average play duration
            let newMinutes = currentMinutes;

            if (newSeconds < 0) {
                newMinutes--;
                newSeconds += 60;
            }

            if (newMinutes >= 0) {
                newState.timeLeft = `${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`;
            }
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
        updateDriveStatus,
        useTimeout,
    ]);

    const updateGameTimer = useCallback(() => {
        updateGameState(prevState => {
            const [minutes, seconds] = prevState.timeLeft.split(':').map(Number);

            // End of quarter logic
            if (minutes === 0 && seconds === 0) {
                if (prevState.quarter < 4) {
                    addCommentary(`That's the end of Q${prevState.quarter}! The teams are heading to the sidelines.`);
                    if (prevState.quarter === 2) {
                        addCommentary("Halftime! Let's take a look at some highlights from the first half.");
                    } else {
                        addCommentary(`As we move into Q${prevState.quarter + 1}, both teams are eager to make adjustments.`);
                    }

                    return {
                        ...prevState,
                        quarter: prevState.quarter + 1,
                        timeLeft: "15:00",
                        playType: 'kickoff',
                        driveStatus: "",
                    };
                }
                // Handle overtime scenarios
                else if (prevState.quarter === 4 && prevState.homeScore === prevState.awayScore) {
                    addCommentary(`We're heading to Overtime! Both teams have fought hard, and it's now sudden death.`);
                    return {
                        ...prevState,
                        quarter: prevState.quarter + 1,
                        timeLeft: "10:00", // Shorter overtime quarter
                        playType: 'kickoff',
                        gameStatus: "Overtime",
                    };
                }
                // End of game logic
                else {
                    addCommentary(`And that's the game! What a thrilling match! Final Score: ${prevState.homeScore} - ${prevState.awayScore}`);
                    return {
                        ...prevState,
                        gameStatus: "Finished",
                        timeLeft: "00:00",
                    };
                }
            }

            // Regular play update
            const totalSeconds = minutes * 60 + seconds - 15;
            const newMinutes = Math.floor(totalSeconds / 60);
            const newSeconds = totalSeconds % 60;

            // Add exciting commentary based on the timing
            if (newMinutes === 0 && newSeconds <= 30) {
                addCommentary(`${prevState.quarter === 4 ? 'Final moments' : 'Last seconds'} of Q${prevState.quarter}! Both teams need to make big plays now!`);
            } else if (newMinutes === 2 && newSeconds === 0 && prevState.quarter === 4) {
                addCommentary("Two-minute warning! Time is running out, and both teams know it's now or never.");
            }

            // Simulate a play
            return {
                ...generatePlay(prevState),
                timeLeft: `${String(newMinutes).padStart(2, '0')}:${String(newSeconds).padStart(2, '0')}`
            };
        });
    }, [generatePlay, updateGameState, addCommentary]);

    useEffect(() => {
        if (gameState.gameStatus === "Not Started" && homeTeam && awayTeam) {
            addCommentary(`Welcome to this exciting matchup between ${homeTeam.name} and ${awayTeam.name}! The coin toss is up next.`);
            coinToss();
        }

        if (gameState.gameStatus === "In Progress") {
            const gameTimer = setInterval(updateGameTimer, 3000); // Simulate every 3 seconds
            return () => clearInterval(gameTimer);
        }
    }, [gameState.gameStatus, homeTeam, awayTeam, coinToss, updateGameTimer, addCommentary]);


    return null; // This component doesn't render anything
};

export default GameLogic;
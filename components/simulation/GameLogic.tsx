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
    const getRandomPlayer = useCallback(() => {
        const positions = ['QB', 'RB', 'WR', 'TE', 'K', 'P', 'CB', 'S', 'LB', 'DE', 'DT'];

        const position = positions[Math.floor(Math.random() * positions.length)];
        const number = Math.floor(Math.random() * 99) + 1;

        return `#${number} (${position})`;
    }, []);

    // Enhanced updateDriveStatus with pro NFL commentary
    const updateDriveStatus = useCallback((state: GameState) => {
        const currentTeam = state.possession === 'home' ? homeTeam : awayTeam;
        const yardLine = state.fieldPosition > 50 ? 100 - state.fieldPosition : state.fieldPosition;
        const side = state.fieldPosition > 50 ? "opponent's" : "own";
        const down = `${state.down}${['st', 'nd', 'rd'][state.down - 1] || 'th'}`;
        const driveStr = `${currentTeam?.name} ${down} & ${state.yardsToGo} at ${side} ${yardLine}`;

        // Enhanced commentary based on game situations
        if (yardLine <= 20) {
            addCommentary(`${currentTeam?.name} is in the red zone! They're threatening to score.`);
        }

        if (yardLine <= 10) {
            addCommentary(`${currentTeam?.name} is knocking on the door! Only ${yardLine} yards to go.`);
        }

        if (state.yardsToGo <= 1) {
            addCommentary(`${currentTeam?.name} faces a crucial ${down} and short. Every inch counts.`);
        } else if (state.down === 4 && state.yardsToGo > 5) {
            addCommentary(`${currentTeam?.name} faces a challenging ${down} and long. A gutsy call if they go for it!`);
        }

        if (state.down === 4 && state.fieldPosition > 50 && state.yardsToGo <= 3) {
            addCommentary(`It's 4th and short, and ${currentTeam?.name} is going for it! This could be a game-changer.`);
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
        const kickDistance = Math.floor(Math.random() * 15) + 65; // Slightly longer kicks for realism
        const returnDistance = Math.floor(Math.random() * 30); // Return between 0 to 30 yards
        const newFieldPosition = Math.min(Math.max(20, 100 - kickDistance + returnDistance), 50); // Ensure at least 20-yard line start

        const receivingTeam = state.possession === 'home' ? homeTeam : awayTeam;

        const newState: GameState = {
            ...state,
            fieldPosition: newFieldPosition,
            down: 1,
            yardsToGo: 10,
            possession: state.possession === 'home' ? 'away' : 'home',
            playType: 'normal'
        };

        // Commentary Improvements
        const kickDistanceStr = `${kickDistance}-yard kick`;
        const returnDistanceStr = returnDistance > 0 ? `returned for ${returnDistance} yards` : 'no return on the play';
        addCommentary(`${kickingTeam?.name} kicks off. The ball travels ${kickDistanceStr}, ${returnDistanceStr}.`);
        addCommentary(`${receivingTeam?.name} will start their drive from the ${newFieldPosition}-yard line.`);

        return newState;
    }, [homeTeam, awayTeam, addCommentary]);

    const extraPoint = useCallback((state: GameState): GameState => {
        const scoringTeam = state.possession === 'home' ? homeTeam : awayTeam;
        const specialTeamsRating = scoringTeam?.specialTeams || 80;
        const successRate = specialTeamsRating / 100;
        const kickSuccess = Math.random() < successRate;

        const newState: GameState = {
            ...state,
            homeScore: state.possession === 'home' ? state.homeScore + (kickSuccess ? 1 : 0) : state.homeScore,
            awayScore: state.possession === 'away' ? state.awayScore + (kickSuccess ? 1 : 0) : state.awayScore,
            playType: 'kickoff',
            possession: state.possession === 'home' ? 'away' : 'home',
        };

        if (kickSuccess) {
            addCommentary(`The kick is up... and it's good! ${scoringTeam?.name} extends their lead with an extra point.`);
        } else {
            addCommentary(`The kick is up... and it's wide right! No extra point for ${scoringTeam?.name}.`);
        }

        return newState;
    }, [homeTeam, awayTeam, addCommentary]);

    const twoPointConversion = useCallback((state: GameState): GameState => {
        const scoringTeam = state.possession === 'home' ? homeTeam : awayTeam;
        const offenseRating = scoringTeam?.offense || 80;
        const successRate = offenseRating / 200;
        const conversionSuccess = Math.random() < successRate;

        const newState: GameState = {
            ...state,
            homeScore: state.possession === 'home' ? state.homeScore + (conversionSuccess ? 2 : 0) : state.homeScore,
            awayScore: state.possession === 'away' ? state.awayScore + (conversionSuccess ? 2 : 0) : state.awayScore,
            playType: 'kickoff',
            possession: state.possession === 'home' ? 'away' : 'home',
        };

        if (conversionSuccess) {
            addCommentary(`The offense goes for two... and they get it! ${scoringTeam?.name} pulls off the two-point conversion.`);
        } else {
            addCommentary(`The offense goes for two... but they're stopped short! No two points for ${scoringTeam?.name}.`);
        }

        return newState;
    }, [homeTeam, awayTeam, addCommentary]);


    const handleFourthDown = useCallback((state: GameState): GameState => {
        const currentTeam = state.possession === 'home' ? homeTeam : awayTeam;
        const fieldGoalRange = 65;
        const shortYards = 3;

        // Simulate field goal if in range
        if (state.fieldPosition > fieldGoalRange && state.yardsToGo <= shortYards) {
            const specialTeamsRating = currentTeam?.specialTeams || 80;
            const successRate = specialTeamsRating / 100;
            const fieldGoalSuccess = Math.random() < successRate;

            if (fieldGoalSuccess) {
                addCommentary(`${currentTeam?.name} lines up for a field goal... and it's good! They add three more points.`);
                return {
                    ...state,
                    homeScore: state.possession === 'home' ? state.homeScore + 3 : state.homeScore,
                    awayScore: state.possession === 'away' ? state.awayScore + 3 : state.awayScore,
                    playType: 'normal',  // Reset to normal to avoid extra point logic issues
                    possession: state.possession === 'home' ? 'away' : 'home',
                    down: 1,
                    yardsToGo: 10,
                    fieldPosition: 35, // Reset for kickoff
                };
            } else {
                addCommentary(`${currentTeam?.name} lines up for a field goal... but it's no good! The kick sails wide.`);
                return {
                    ...state,
                    playType: 'normal',  // Ensure playType is reset
                    possession: state.possession === 'home' ? 'away' : 'home',
                    down: 1,
                    yardsToGo: 10,
                    fieldPosition: 100 - state.fieldPosition,
                };
            }
        }

        // Simulate punt
        if (state.fieldPosition < fieldGoalRange || state.yardsToGo > shortYards) {
            const puntDistance = Math.floor(Math.random() * 20) + 40;
            const newFieldPosition = Math.max(20, Math.min(100 - state.fieldPosition - puntDistance, 80));
            addCommentary(`${currentTeam?.name} punts the ball. The receiving team will start at their own ${newFieldPosition}-yard line.`);

            return {
                ...state,
                playType: 'normal',  // Reset playType after punt
                fieldPosition: newFieldPosition,
                possession: state.possession === 'home' ? 'away' : 'home',
                down: 1,
                yardsToGo: 10,
            };
        }

        // Turnover on downs
        addCommentary(`${currentTeam?.name} goes for it on 4th down... and they don't get it! Turnover on downs.`);
        return {
            ...state,
            playType: 'normal',  // Reset playType after turnover on downs
            possession: state.possession === 'home' ? 'away' : 'home',
            down: 1,
            yardsToGo: 10,
            fieldPosition: 100 - state.fieldPosition,  // Flip the field position
        };
    }, [homeTeam, awayTeam, addCommentary]);

    const generateWeather = useCallback(() => {
        // Enhanced weather conditions with varying intensity
        const conditions = [
            { type: 'Clear', impact: 0 },
            { type: 'Cloudy', impact: 1 },
            { type: 'Rainy', impact: 3 },
            { type: 'Windy', impact: 2 },
            { type: 'Snowy', impact: 4 },
            { type: 'Thunderstorm', impact: 5 }
        ];

        // Randomly select a weather condition
        const selectedCondition = conditions[Math.floor(Math.random() * conditions.length)];
        const { type: newWeather, impact } = selectedCondition;

        // Set the new weather state
        setWeather(newWeather);

        // Generate dynamic commentary based on the weather's intensity and impact
        if (impact === 0) {
            addCommentary(`It's a perfect day for football! The weather is ${newWeather.toLowerCase()} with no impact on the game.`);
        } else if (impact === 1) {
            addCommentary(`The skies are ${newWeather.toLowerCase()}, but it won't affect the players much. Expect smooth gameplay.`);
        } else if (impact === 2) {
            addCommentary(`The wind is picking up! ${newWeather.toLowerCase()} conditions could make long passes tricky.`);
        } else if (impact === 3) {
            addCommentary(`It's getting wet out there! ${newWeather.toLowerCase()} weather will make the field slick, and ball control might become a challenge.`);
        } else if (impact === 4) {
            addCommentary(`Snow is starting to fall! The ${newWeather.toLowerCase()} conditions will slow things down, making every yard count.`);
        } else if (impact === 5) {
            addCommentary(`Brace yourselves, a ${newWeather.toLowerCase()} is rolling in! The conditions are intense, making every play even more unpredictable.`);
        }
    }, [setWeather, addCommentary]);

    // Hook to trigger weather change at the start of each quarter
    useEffect(() => {
        // Weather changes at the start of each quarter
        if (gameState.quarter === 1 || gameState.quarter > 1) {
            generateWeather();
        }
    }, [gameState.quarter, generateWeather]);

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
        const player = getRandomPlayer();

        // Injury types and recovery times
        const injuryTypes = [
            { type: 'minor', description: 'sprain', recoveryTime: 'few plays' },
            { type: 'serious', description: 'torn ligament', recoveryTime: 'rest of the game' },
            { type: 'moderate', description: 'bruised ribs', recoveryTime: 'quarter or more' }
        ];

        // Randomly choose injury severity and type
        const injury = injuryTypes[Math.floor(Math.random() * injuryTypes.length)];

        // Update the injury status
        updateInjuries(team, player);

        // Get team name for commentary
        const teamName = team === 'home' ? homeTeam?.name : awayTeam?.name;

        // Expert NFL-style commentary
        let commentary = `${teamName}'s ${player} is down on the field!`;
        if (injury.type === 'minor') {
            commentary += ` It's a ${injury.description}. Looks like they'll be back in action after a ${injury.recoveryTime}.`;
        } else if (injury.type === 'moderate') {
            commentary += ` Ouch, that looks like a ${injury.description}. ${player} will be out for at least a ${injury.recoveryTime}.`;
        } else {
            commentary += ` Oh no, it's a ${injury.description}! Medical staff are on the field, and it looks like ${player} is out for the ${injury.recoveryTime}.`;
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

    const generatePlay = useCallback((state: GameState): GameState => {
        if (!homeTeam || !awayTeam) return state;

        // Handle special play types (kickoff, extra point, two-point conversion)
        if (state.playType === "kickoff") return kickoff(state);
        if (state.playType === "extraPoint") return extraPoint(state);
        if (state.playType === "twoPointConversion") return twoPointConversion(state);

        const offenseTeam = state.possession === "home" ? homeTeam : awayTeam;
        const defenseTeam = state.possession === "home" ? awayTeam : homeTeam;

        // Dynamic play options and their base weights
        const playOptions = ["run", "shortPass", "longPass", "sack", "fumble", "interception"];
        const playWeights = [0.35, 0.3, 0.15, 0.1, 0.05, 0.05];

        // Generate the play selection using weighted randomness
        const selectedPlay = weightedRandomChoice(
            playOptions, playWeights,
            state.down, state.yardsToGo, state.fieldPosition,
            state.timeLeft, offenseTeam.offense, defenseTeam.defense
        );

        let yards = 0;
        let turnover = false;
        let commentary = "";

        const offensivePlayer = getRandomPlayer();
        const defensivePlayer = getRandomPlayer();

        const offenseRating = offenseTeam.offense;
        const defenseRating = defenseTeam.defense;
        const playSuccess = Math.random() * (offenseRating + defenseRating) < offenseRating;

        // Play execution and detailed commentary
        switch (selectedPlay) {
            case "run":
                yards = playSuccess ? Math.floor(Math.random() * 10) + 1 : Math.floor(Math.random() * 3) - 2;
                commentary = playSuccess
                    ? `${offenseTeam.name}'s ${offensivePlayer} powers through for ${yards} yards!`
                    : `${defenseTeam.name} stuffs the run! ${offensivePlayer} is stopped for a loss of ${Math.abs(yards)} yards.`;
                break;

            case "shortPass":
                yards = playSuccess ? Math.floor(Math.random() * 15) + 3 : 0;
                turnover = !playSuccess && Math.random() < 0.1;
                commentary = playSuccess
                    ? `${offenseTeam.name}'s QB zips it to ${offensivePlayer} for a gain of ${yards} yards.`
                    : `Pressure by ${defenseTeam.name}! The pass falls incomplete.`;
                if (turnover) commentary += ` Interception by ${defensivePlayer} from ${defenseTeam.name}!`;
                break;

            case "longPass":
                yards = playSuccess ? Math.floor(Math.random() * 40) + 15 : 0;
                turnover = !playSuccess && Math.random() < 0.15;
                commentary = playSuccess
                    ? `${offenseTeam.name}'s QB launches it deep! ${offensivePlayer} hauls it in for ${yards} yards!`
                    : `${defenseTeam.name} shuts down the deep pass attempt! Incomplete.`;
                if (turnover) commentary += ` Interception by ${defensivePlayer} from ${defenseTeam.name}!`;
                break;

            case "sack":
                yards = -Math.floor(Math.random() * 10) - 1;
                turnover = Math.random() < 0.05;
                commentary = `Sack! ${defensivePlayer} from ${defenseTeam.name} drops the QB for a loss of ${Math.abs(yards)} yards.`;
                if (turnover) commentary += ` The ball is loose! ${defenseTeam.name} recovers!`;
                break;

            case "fumble":
                turnover = true;
                commentary = `Fumble! ${offenseTeam.name}'s ${offensivePlayer} coughs up the ball! ${defenseTeam.name} recovers!`;
                break;

            case "interception":
                turnover = true;
                commentary = `Interception! ${defensivePlayer} from ${defenseTeam.name} snatches the ball out of the air! What a play!`;
                break;
        }

        // Update the field position within limits (0-100 yards)
        let newFieldPosition = Math.min(Math.max(state.fieldPosition + yards, 0), 100);

        // Handle turnovers (change possession and adjust field position)
        if (turnover) {
            commentary += ` Turnover! ${defenseTeam.name} takes over on offense.`;
            newFieldPosition = 100 - newFieldPosition;  // Flip field position
            addEvent(`Turnover by ${offenseTeam.name}`);
        }

        // Update game state
        let newState = {
            ...state,
            fieldPosition: newFieldPosition,
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

        // Handle first down logic
        if (newState.yardsToGo <= 0) {
            newState = {
                ...newState,
                down: 1,
                yardsToGo: 10,
            };
            addCommentary(`${offenseTeam.name} converts for a first down!`);
        }

        // Fourth down logic
        if (newState.down === 4 && newState.yardsToGo > 0) {
            newState = handleFourthDown(newState);
        }

        // Handle touchdown logic
        if (newState.fieldPosition >= 100) {
            commentary += ` Touchdown ${offenseTeam.name}! The crowd is going wild!`;
            newState = {
                ...newState,
                homeScore: state.possession === "home" ? state.homeScore + 6 : state.awayScore + 6,
                playType: Math.random() < 0.95 ? "extraPoint" : "twoPointConversion",
                fieldPosition: 98, // Reset for extra point or two-point conversion
            };
            addEvent(`Touchdown by ${offenseTeam.name}`);
        }

        // Handle random events (injury, penalty, weather changes)
        if (Math.random() < 0.05) generateInjury(state.possession);
        if (Math.random() < 0.1) newState = generatePenalty(newState);
        if (Math.random() < 0.02) generateWeather();
        updateCrowd(newState);

        // Add final commentary and return updated state
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
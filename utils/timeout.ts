import { GameState, Team } from '../lib/types'; // Correct the path based on your file structure.

// utils/timeout.ts
export const timeout = (state: GameState, team: 'home' | 'away', addCommentary: (message: string) => void, homeTeam: Team | null, awayTeam: Team | null): GameState => {
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
};

export type Bet = {
    id: number;
    team: string;
    opponent: string;  // Field for the opposing team
    amount: number;
    odds: string;      // Odds are now handled as a string (e.g., +200, -150)
    date: Date;
    description?: string;
    result: 'win' | 'loss' | 'pending';
    betType: string;   // Type of bet (e.g., OVR, PLB)
    ticketCost: number; // Cost of the bet ticket
    payout: number;    // Potential payout
};

// lib/types.ts

export interface GameState {
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

export interface Team {
    name: string;
    abbreviation: string;
    color: string;
    logo: string;
    offense: number;
    defense: number;
    specialTeams: number;
}

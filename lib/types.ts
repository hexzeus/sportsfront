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

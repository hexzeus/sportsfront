'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bet } from '../lib/types';
import { FaDollarSign, FaChartLine, FaCalendarAlt, FaClipboardList, FaTrophy } from 'react-icons/fa';

interface BetFormProps {
    onSubmit: (bet: Omit<Bet, 'id'>, token: string) => Promise<void>;
    initialData?: Partial<Bet>;
}

const commonBetTypes = [
    'Moneyline',
    'Point Spread',
    'Over/Under',
    'Parlay',
    'Teaser',
    'Futures',
    'Prop Bet',
    'Live Bet',
    'Total Points',
    'Round Robin',
    'Double Chance',
    'Straight',
    'First Half Bet',
    'Second Half Bet',
    'In-Play Betting',
    'Accumulator Bet',
    'Head-to-Head Bet',
    'Handicap Bet',
    'Exact Score Bet',
    'Win/Draw/Win Bet',
    'Correct Score Bet',
    'Outright Bet',
    'Single Bet'
];

const teams = {
    NFL: [
        'Arizona Cardinals', 'Atlanta Falcons', 'Baltimore Ravens', 'Buffalo Bills', 'Carolina Panthers',
        'Chicago Bears', 'Cincinnati Bengals', 'Cleveland Browns', 'Dallas Cowboys', 'Denver Broncos',
        'Detroit Lions', 'Green Bay Packers', 'Houston Texans', 'Indianapolis Colts', 'Jacksonville Jaguars',
        'Kansas City Chiefs', 'Las Vegas Raiders', 'Los Angeles Chargers', 'Los Angeles Rams', 'Miami Dolphins',
        'Minnesota Vikings', 'New England Patriots', 'New Orleans Saints', 'New York Giants', 'New York Jets',
        'Philadelphia Eagles', 'Pittsburgh Steelers', 'San Francisco 49ers', 'Seattle Seahawks', 'Tampa Bay Buccaneers',
        'Tennessee Titans', 'Washington Football Team'
    ],
    NBA: [
        'Atlanta Hawks', 'Boston Celtics', 'Brooklyn Nets', 'Charlotte Hornets', 'Chicago Bulls',
        'Cleveland Cavaliers', 'Dallas Mavericks', 'Denver Nuggets', 'Detroit Pistons', 'Golden State Warriors',
        'Houston Rockets', 'Indiana Pacers', 'Los Angeles Clippers', 'Los Angeles Lakers', 'Memphis Grizzlies',
        'Miami Heat', 'Milwaukee Bucks', 'Minnesota Timberwolves', 'New Orleans Pelicans', 'New York Knicks',
        'Oklahoma City Thunder', 'Orlando Magic', 'Philadelphia 76ers', 'Phoenix Suns', 'Portland Trail Blazers',
        'Sacramento Kings', 'San Antonio Spurs', 'Toronto Raptors', 'Utah Jazz', 'Washington Wizards'
    ],
    NHL: [
        'Anaheim Ducks', 'Arizona Coyotes', 'Boston Bruins', 'Buffalo Sabres', 'Calgary Flames',
        'Carolina Hurricanes', 'Chicago Blackhawks', 'Colorado Avalanche', 'Columbus Blue Jackets', 'Dallas Stars',
        'Detroit Red Wings', 'Edmonton Oilers', 'Florida Panthers', 'Los Angeles Kings', 'Minnesota Wild',
        'Montreal Canadiens', 'Nashville Predators', 'New Jersey Devils', 'New York Islanders', 'New York Rangers',
        'Ottawa Senators', 'Philadelphia Flyers', 'Pittsburgh Penguins', 'San Jose Sharks', 'Seattle Kraken',
        'St. Louis Blues', 'Tampa Bay Lightning', 'Toronto Maple Leafs', 'Vancouver Canucks', 'Vegas Golden Knights',
        'Washington Capitals', 'Winnipeg Jets'
    ],
    MLB: [
        'Arizona Diamondbacks', 'Atlanta Braves', 'Baltimore Orioles', 'Boston Red Sox', 'Chicago Cubs',
        'Chicago White Sox', 'Cincinnati Reds', 'Cleveland Guardians', 'Colorado Rockies', 'Detroit Tigers',
        'Houston Astros', 'Kansas City Royals', 'Los Angeles Angels', 'Los Angeles Dodgers', 'Miami Marlins',
        'Milwaukee Brewers', 'Minnesota Twins', 'New York Mets', 'New York Yankees', 'Oakland Athletics',
        'Philadelphia Phillies', 'Pittsburgh Pirates', 'San Diego Padres', 'San Francisco Giants', 'Seattle Mariners',
        'St. Louis Cardinals', 'Tampa Bay Rays', 'Texas Rangers', 'Toronto Blue Jays', 'Washington Nationals'
    ]
};

const commonAmounts = [10, 20, 50, 100, 200, 500, 1000];
const commonOdds = ['+100', '-110', '+200', '-150', '+300', '-200', '+500'];
const commonTicketCosts = [5, 10, 15, 20, 25, 50, 100];
const commonPayouts = [50, 100, 200, 500, 1000, 1500, 2000];

export default function BetForm({ onSubmit, initialData = {} }: BetFormProps) {
    const [team, setTeam] = useState(initialData.team || '');
    const [opponent, setOpponent] = useState(initialData.opponent || '');
    const [amount, setAmount] = useState(initialData.amount || 0);
    const [customAmount, setCustomAmount] = useState('');
    const [odds, setOdds] = useState(initialData.odds || '');
    const [customOdds, setCustomOdds] = useState('');
    const [date, setDate] = useState(initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '');
    const [description, setDescription] = useState(initialData.description || '');
    const [result, setResult] = useState<'win' | 'loss' | 'pending'>(initialData.result || 'pending');
    const [betType, setBetType] = useState(initialData.betType || '');
    const [customBetType, setCustomBetType] = useState('');
    const [ticketCost, setTicketCost] = useState(initialData.ticketCost || 0);
    const [customTicketCost, setCustomTicketCost] = useState('');
    const [payout, setPayout] = useState(initialData.payout || 0);
    const [customPayout, setCustomPayout] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const resetForm = () => {
        setTeam('');
        setOpponent('');
        setAmount(0);
        setCustomAmount('');
        setOdds('');
        setCustomOdds('');
        setDate('');
        setDescription('');
        setResult('pending');
        setBetType('');
        setCustomBetType('');
        setTicketCost(0);
        setCustomTicketCost('');
        setPayout(0);
        setCustomPayout('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("adminToken");
        if (!token) {
            setError("You must be logged in as admin to submit bets.");
            return;
        }

        const finalAmount = customAmount ? parseFloat(customAmount) : parseFloat(amount.toString());
        const finalOdds = customOdds || odds;
        const finalBetType = customBetType || betType;
        const finalTicketCost = customTicketCost ? parseFloat(customTicketCost) : parseFloat(ticketCost.toString());
        const finalPayout = customPayout ? parseFloat(customPayout) : parseFloat(payout.toString());

        const bet = {
            team,
            opponent,
            amount: finalAmount,
            odds: finalOdds,
            date: new Date(date),
            description,
            result,
            betType: finalBetType,
            ticketCost: finalTicketCost,
            payout: finalPayout,
        };

        try {
            await onSubmit(bet, token);
            setSuccess("Bet successfully submitted!");
            setError("");
            resetForm();
        } catch (err) {
            setError("Failed to submit bet. Please try again.");
            setSuccess("");
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#1e1e1e] to-[#0c0c0c] p-4 sm:p-6 md:p-10 rounded-lg shadow-2xl text-[#e0e0e0] border border-[#1a73e8] max-w-xl md:max-w-2xl mx-auto space-y-6 sm:space-y-8 relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-[#0c0c0c]/50 via-[#1e1e1e]/20 to-[#111111]/50 pointer-events-none"></div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-[#007acc] via-[#005f99] to-[#003f66] mb-6 sm:mb-8 relative z-10" style={{ fontFamily: 'Impact, sans-serif' }}>
                CREATE BET TICKET
            </h2>

            {error && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[#ff4c4c] text-center font-bold bg-[#ff4c4c]/20 py-2 rounded-md"
                >
                    {error}
                </motion.p>
            )}
            {success && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[#00cc66] text-center font-bold bg-[#00cc66]/20 py-2 rounded-md"
                >
                    {success}
                </motion.p>
            )}

            <div className="space-y-4 sm:space-y-6 relative z-10">
                {/* Team Selection */}
                <div>
                    <label className="block font-semibold text-lg mb-1 text-[#1a73e8]">Team:</label>
                    <select
                        value={team}
                        onChange={(e) => setTeam(e.target.value)}
                        className="w-full p-3 sm:p-4 bg-[#111111] text-[#e0e0e0] rounded-lg border border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] transition duration-200"
                    >
                        <option value="">Select Team</option>
                        {Object.entries(teams).map(([league, teamNames]) => (
                            <optgroup key={league} label={league}>
                                {teamNames.map((teamName) => (
                                    <option key={teamName} value={teamName}>
                                        {teamName}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                    <p className="mt-2 text-sm text-[#b0b0b0]">Or write your own team name below:</p>
                    <input
                        type="text"
                        value={team}
                        onChange={(e) => setTeam(e.target.value)}
                        className="w-full mt-2 p-3 sm:p-4 bg-[#111111] text-[#e0e0e0] rounded-lg border border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] transition duration-200"
                        placeholder="Write your own team name"
                    />
                </div>

                {/* Opponent Selection */}
                <div>
                    <label className="block font-semibold text-lg mb-1 text-[#1a73e8]">Opponent:</label>
                    <select
                        value={opponent}
                        onChange={(e) => setOpponent(e.target.value)}
                        className="w-full p-3 sm:p-4 bg-[#111111] text-[#e0e0e0] rounded-lg border border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] transition duration-200"
                    >
                        <option value="">Select Opponent</option>
                        {Object.entries(teams).map(([league, teamNames]) => (
                            <optgroup key={league} label={league}>
                                {teamNames.map((teamName) => (
                                    <option key={teamName} value={teamName}>
                                        {teamName}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                    <p className="mt-2 text-sm text-[#b0b0b0]">Or write your own opponent&apos;s name below:</p>
                    <input
                        type="text"
                        value={opponent}
                        onChange={(e) => setOpponent(e.target.value)}
                        className="w-full mt-2 p-3 sm:p-4 bg-[#111111] text-[#e0e0e0] rounded-lg border border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] transition duration-200"
                        placeholder="Write your own opponent's name"
                    />
                </div>

                {/* Amount and Odds Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-semibold text-lg mb-1 text-[#1a73e8]">Amount:</label>
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <select
                                value={amount}
                                onChange={(e) => setAmount(parseFloat(e.target.value))}
                                className="w-full p-3 sm:p-4 bg-[#111111] text-[#e0e0e0] rounded-lg border border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] transition duration-200"
                            >
                                <option value="">Select Amount</option>
                                {commonAmounts.map((amount) => (
                                    <option key={amount} value={amount}>
                                        ${amount}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Custom amount"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                                className="w-full p-3 sm:p-4 bg-[#111111] text-[#e0e0e0] rounded-lg border border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] transition duration-200"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-semibold text-lg mb-1 text-[#1a73e8]">Odds:</label>
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <select
                                value={odds}
                                onChange={(e) => setOdds(e.target.value)}
                                className="w-full p-3 sm:p-4 bg-[#111111] text-[#e0e0e0] rounded-lg border border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] transition duration-200"
                            >
                                <option value="">Select Odds</option>
                                {commonOdds.map((odds) => (
                                    <option key={odds} value={odds}>
                                        {odds}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Custom odds"
                                value={customOdds}
                                onChange={(e) => setCustomOdds(e.target.value)}
                                className="w-full p-3 sm:p-4 bg-[#111111] text-[#e0e0e0] rounded-lg border border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] transition duration-200"
                            />
                        </div>
                    </div>
                </div>

                {/* Date Selection */}
                <div>
                    <label className="block font-semibold text-lg mb-1 text-[#1a73e8]">Date:</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-3 sm:p-4 bg-[#111111] text-[#e0e0e0] rounded-lg border border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] transition duration-200"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block font-semibold text-lg mb-1 text-[#1a73e8]">Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 sm:p-4 bg-[#111111] text-[#e0e0e0] rounded-lg border border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] transition duration-200"
                        rows={4}
                        placeholder="Describe the bet"
                    />
                </div>

                {/* Result Selection */}
                <div>
                    <label className="block font-semibold text-lg mb-1 text-[#1a73e8]">Result:</label>
                    <select
                        value={result}
                        onChange={(e) => setResult(e.target.value as 'win' | 'loss' | 'pending')}
                        className="w-full p-3 sm:p-4 bg-[#111111] text-[#e0e0e0] rounded-lg border border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] transition duration-200"
                        required
                    >
                        <option value="win">Win</option>
                        <option value="loss">Loss</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>

                {/* Bet Type Selection */}
                <div>
                    <label className="block font-semibold text-lg mb-1 text-[#1a73e8]">Bet Type:</label>
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <select
                            value={betType}
                            onChange={(e) => setBetType(e.target.value)}
                            className="w-full p-3 sm:p-4 bg-[#111111] text-[#e0e0e0] rounded-lg border border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] transition duration-200"
                        >
                            <option value="">Select Bet Type</option>
                            {commonBetTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Custom bet type"
                            value={customBetType}
                            onChange={(e) => setCustomBetType(e.target.value)}
                            className="w-full p-3 sm:p-4 bg-[#111111] text-[#e0e0e0] rounded-lg border border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] transition duration-200"
                        />
                    </div>
                </div>

                {/* Ticket Cost and Payout Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-semibold text-lg mb-1 text-[#1a73e8]">Ticket Cost:</label>
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <select
                                value={ticketCost}
                                onChange={(e) => setTicketCost(parseFloat(e.target.value))}
                                className="w-full p-3 sm:p-4 bg-[#111111] text-[#e0e0e0] rounded-lg border border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] transition duration-200"
                            >
                                <option value="">Select Ticket Cost</option>
                                {commonTicketCosts.map((cost) => (
                                    <option key={cost} value={cost}>
                                        ${cost}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Custom ticket cost"
                                value={customTicketCost}
                                onChange={(e) => setCustomTicketCost(e.target.value)}
                                className="w-full p-3 sm:p-4 bg-[#111111] text-[#e0e0e0] rounded-lg border border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] transition duration-200"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-semibold text-lg mb-1 text-[#1a73e8]">Payout:</label>
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <select
                                value={payout}
                                onChange={(e) => setPayout(parseFloat(e.target.value))}
                                className="w-full p-3 sm:p-4 bg-[#111111] text-[#e0e0e0] rounded-lg border border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] transition duration-200"
                            >
                                <option value="">Select Payout</option>
                                {commonPayouts.map((payout) => (
                                    <option key={payout} value={payout}>
                                        ${payout}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Custom payout"
                                value={customPayout}
                                onChange={(e) => setCustomPayout(e.target.value)}
                                className="w-full p-3 sm:p-4 bg-[#111111] text-[#e0e0e0] rounded-lg border border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] transition duration-200"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(26, 115, 232, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="mt-6 sm:mt-8 w-full py-3 sm:py-4 bg-gradient-to-r from-[#1a73e8] to-[#005f99] hover:from-[#007acc] hover:to-[#003f66] text-[#e0e0e0] text-lg font-bold uppercase rounded-lg shadow-lg transition-all duration-300 relative z-10"
            >
                Submit Bet
            </motion.button>
        </motion.form>
    );
}

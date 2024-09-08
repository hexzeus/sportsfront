import React, { useState } from 'react';
import { X, PieChart, BarChart, Shield, Award, DollarSign } from 'lucide-react';

const SportsAnalysisButton: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('fairness');

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const tabContent = {
        fairness: (
            <>
                <h3 className="text-lg font-bold mb-2">Fairness & Odds Breakdown</h3>
                <ul className="list-disc ml-5 text-xs sm:text-sm leading-relaxed text-zinc-300">
                    <li><strong>Game Winner:</strong> 50% chance for either team</li>
                    <li><strong>Play Types:</strong> Dynamic based on the game situation (run, pass, sack, turnover)</li>
                    <li><strong>Penalty Chance:</strong> 10% chance of a penalty on any given play</li>
                    <li><strong>Turnover Chance:</strong> 5% chance of a turnover</li>
                </ul>
            </>
        ),
        gameStats: (
            <>
                <h3 className="text-lg font-bold mb-2">Game Statistics</h3>
                <ul className="list-disc ml-5 text-xs sm:text-sm leading-relaxed text-zinc-300">
                    <li><strong>Duration:</strong> ~12 real-time minutes</li>
                    <li><strong>Total Plays:</strong> 240 (60 per quarter)</li>
                    <li><strong>Avg. Yards Per Play:</strong> 6-15 yards depending on the play</li>
                    <li><strong>Scoring:</strong> Touchdown (6 points), Extra Point (1 point), Field Goal (3 points)</li>
                </ul>
            </>
        ),
        gameMechanics: (
            <>
                <h3 className="text-lg font-bold mb-2">Game Mechanics</h3>
                <ul className="list-disc ml-5 text-xs sm:text-sm leading-relaxed text-zinc-300">
                    <li><strong>Random Team Selection:</strong> Teams are randomly chosen for each game</li>
                    <li><strong>Player Generation:</strong> Random player numbers and positions for commentary</li>
                    <li><strong>Field Position:</strong> Tracked and updated after each play</li>
                    <li><strong>Downs:</strong> Standard 4-down system with first down on 10 yards gained</li>
                    <li><strong>Game Clock:</strong> Simulated with 15-minute quarters</li>
                    <li><strong>Commentary:</strong> Dynamic based on play outcomes and game situation</li>
                </ul>
            </>
        ),
        bets: (
            <>
                <h3 className="text-lg font-bold mb-2">Friendly Bet Options with Odds and Percentages</h3>
                <ul className="list-disc ml-5 text-xs sm:text-sm leading-relaxed text-zinc-300">
                    <li><strong>Who Will Score the Next Touchdown?</strong>
                        <ul>
                            <li>RB: 2:1 (33% chance)</li>
                            <li>WR: 3:1 (25% chance)</li>
                            <li>QB: 8:1 (11% chance)</li>
                            <li>TE: 6:1 (14% chance)</li>
                        </ul>
                    </li>
                    <li><strong>Will the Team Go for a Field Goal on 4th Down?</strong>
                        <ul>
                            <li>Yes: 1.8:1 (35% chance)</li>
                            <li>No: 2.5:1 (25% chance)</li>
                        </ul>
                    </li>
                    <li><strong>Next Play Will Result In... (Run, Pass, Sack, Turnover)</strong>
                        <ul>
                            <li>Run: 1.8:1 (40% chance)</li>
                            <li>Pass: 2.2:1 (35% chance)</li>
                            <li>Sack: 8:1 (10% chance)</li>
                            <li>Turnover: 12:1 (5% chance)</li>
                        </ul>
                    </li>
                    <li><strong>Will There Be an Injury in This Quarter?</strong>
                        <ul>
                            <li>Yes: 4:1 (20% chance)</li>
                            <li>No: 1.3:1 (80% chance)</li>
                        </ul>
                    </li>
                    <li><strong>Penalty on the Next Play?</strong>
                        <ul>
                            <li>Yes: 3:1 (10% chance)</li>
                            <li>No: 1.5:1 (90% chance)</li>
                        </ul>
                    </li>
                    <li><strong>Over/Under on Total Yardage in This Drive (50 yards)</strong>
                        <ul>
                            <li>Over 50 yards: 2.1:1 (30% chance)</li>
                            <li>Under 50 yards: 1.5:1 (70% chance)</li>
                        </ul>
                    </li>
                    <li><strong>Who Will Win the Coin Toss?</strong>
                        <ul>
                            <li>Home Team: 1:1 (50% chance)</li>
                            <li>Away Team: 1:1 (50% chance)</li>
                        </ul>
                    </li>
                    <li><strong>Will the Next Drive End in a Turnover?</strong>
                        <ul>
                            <li>Yes: 6:1 (15% chance)</li>
                            <li>No: 1.2:1 (85% chance)</li>
                        </ul>
                    </li>
                    <li><strong>Total Points Scored by the End of the Quarter (Over/Under 14 points)</strong>
                        <ul>
                            <li>Over 14 points: 2.1:1 (40% chance)</li>
                            <li>Under 14 points: 1.7:1 (60% chance)</li>
                        </ul>
                    </li>
                    <li><strong>Will the Game Go into Overtime?</strong>
                        <ul>
                            <li>Yes: 7:1 (12% chance)</li>
                            <li>No: 1.1:1 (88% chance)</li>
                        </ul>
                    </li>
                </ul>
            </>
        )
    };

    return (
        <div className="relative">
            <button
                onClick={toggleModal}
                className="group relative inline-flex items-center justify-center px-3 py-2 text-xs sm:text-sm font-semibold text-white uppercase tracking-widest transition-all duration-300 ease-out bg-transparent border border-blue-600 rounded-full hover:bg-blue-800 hover:bg-opacity-90 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transform hover:scale-105"
            >
                <PieChart className="w-3 h-3 sm:w-4 sm:h-4 text-white mr-2" />
                <span className="font-semibold tracking-tight">Simulation Analysis</span>
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300">
                    <div className="relative bg-zinc-900 text-white rounded-lg shadow-lg max-w-md w-full p-4 sm:max-w-2xl sm:p-6 overflow-hidden">
                        <button onClick={toggleModal} className="absolute top-4 right-4 text-white hover:text-blue-400">
                            <X className="w-6 h-6" />
                        </button>
                        <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-yellow-500 to-orange-500 text-center mb-4">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-yellow-500 to-orange-500">
                                SIMULATION INSIGHTS
                            </span>
                        </h2>


                        <div className="flex justify-around mb-4">
                            <button
                                onClick={() => setActiveTab('fairness')}
                                className={`flex items-center px-3 py-2 rounded-t-lg ${activeTab === 'fairness' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}
                            >
                                <Shield className="w-4 h-4 mr-2" />
                                Fairness
                            </button>
                            <button
                                onClick={() => setActiveTab('gameStats')}
                                className={`flex items-center px-3 py-2 rounded-t-lg ${activeTab === 'gameStats' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}
                            >
                                <BarChart className="w-4 h-4 mr-2" />
                                Stats
                            </button>
                            <button
                                onClick={() => setActiveTab('gameMechanics')}
                                className={`flex items-center px-3 py-2 rounded-t-lg ${activeTab === 'gameMechanics' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}
                            >
                                <Award className="w-4 h-4 mr-2" />
                                Mechanics
                            </button>
                            <button
                                onClick={() => setActiveTab('bets')}
                                className={`flex items-center px-3 py-2 rounded-t-lg ${activeTab === 'bets' ? 'bg-zinc-800 text-white' : 'text-zinc-400'}`}
                            >
                                <DollarSign className="w-4 h-4 mr-2" />
                                Bets
                            </button>
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto p-4 bg-zinc-800 rounded-lg">
                            {tabContent[activeTab as keyof typeof tabContent]}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SportsAnalysisButton;

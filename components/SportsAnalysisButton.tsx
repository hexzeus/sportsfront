import React, { useState } from 'react';
import { X, PieChart, BarChart, Shield, Award } from 'lucide-react';

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
                    <li><strong>Play Types:</strong> Equal 20% chance for run, pass, sack, turnover, and special plays</li>
                    <li><strong>Run Success:</strong> 88.2% chance of positive yards, -2 to 14 yards range</li>
                    <li><strong>Pass Success:</strong> 87.5% chance of positive yards, -5 to 35 yards range</li>
                    <li><strong>Sack:</strong> 1 to 10 yards loss</li>
                    <li><strong>Turnover:</strong> 50% interception, 50% fumble when turnover occurs</li>
                    <li><strong>Special Plays:</strong> 20% trick play (20-79 yards gain), 40% field goal attempt, 40% punt</li>
                    <li><strong>Field Goal:</strong> 80% success rate when attempted</li>
                </ul>
            </>
        ),
        gameStats: (
            <>
                <h3 className="text-lg font-bold mb-2">Game Statistics</h3>
                <ul className="list-disc ml-5 text-xs sm:text-sm leading-relaxed text-zinc-300">
                    <li><strong>Duration:</strong> ~12 real-time minutes</li>
                    <li><strong>Total Plays:</strong> 240 (60 per quarter)</li>
                    <li><strong>Play Duration:</strong> 3 seconds real-time</li>
                    <li><strong>Avg. Yards Per Run:</strong> 6 yards</li>
                    <li><strong>Avg. Yards Per Pass:</strong> 15 yards</li>
                    <li><strong>Scoring:</strong> Touchdown (7 points), Field Goal (3 points)</li>
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
        )
    };

    return (
        <div className="relative">
            <button
                onClick={toggleModal}
                className="group relative inline-flex items-center justify-center px-3 py-2 text-xs sm:text-sm font-semibold text-white uppercase tracking-widest transition-all duration-300 ease-out bg-transparent border border-gray-600 rounded-full hover:bg-gray-800 hover:bg-opacity-90 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 transform hover:scale-105"
            >
                <PieChart className="w-3 h-3 sm:w-4 sm:h-4 text-white mr-2" />
                <span className="font-semibold tracking-tight">Simulation Analysis</span>
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300">
                    <div className="relative bg-zinc-900 text-white rounded-lg shadow-lg max-w-md w-full p-4 sm:max-w-2xl sm:p-6 overflow-hidden">
                        <button onClick={toggleModal} className="absolute top-4 right-4 text-white hover:text-red-400">
                            <X className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-500 uppercase text-center mb-4">
                            Simulation Insights
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
import React, { useState } from 'react';
import { X, PieChart } from 'lucide-react';

const SportsAnalysisButton: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div className="relative">
            {/* Sleek and Professional Sports Analysis Button */}
            <button
                onClick={toggleModal}
                className="group relative inline-flex items-center justify-center px-3 py-2 text-xs sm:text-sm font-semibold text-white uppercase tracking-widest transition-all duration-300 ease-out bg-transparent border border-gray-600 rounded-full hover:bg-gray-800 hover:bg-opacity-90 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 transform hover:scale-105"
            >
                <PieChart className="w-3 h-3 sm:w-4 sm:h-4 text-white mr-2" />
                <span className="font-semibold tracking-tight">Simulation Analysis</span>
            </button>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300">
                    <div className="relative bg-zinc-900 text-white rounded-lg shadow-lg max-w-md w-full p-4 sm:max-w-2xl sm:p-6 overflow-hidden">
                        <button onClick={toggleModal} className="absolute top-4 right-4 text-white hover:text-red-400">
                            <X className="w-6 h-6" />
                        </button>

                        <div className="max-h-[80vh] w-full overflow-y-auto p-4">
                            <h2 className="text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-500 uppercase text-center mb-4">
                                Fairness & Odds Breakdown
                            </h2>

                            <p className="text-xs sm:text-sm leading-relaxed text-zinc-300">
                                Our simulation is unbiased and random. Here’s the breakdown of the key probabilities for each play:
                            </p>

                            <ul className="list-disc ml-5 mt-4 text-xs sm:text-sm leading-relaxed text-zinc-300">
                                <li><strong>Game Winner:</strong> 50% chance for either team to win.</li>
                                <li><strong>Turnover (fumble/interception):</strong> 10% per play.</li>
                                <li><strong>Pass Success:</strong> Short-medium pass success: 60-70%, deep passes: 30-40%.</li>
                                <li><strong>Run Success:</strong> 70-75%, typically 1-5 yard gains (80% chance).</li>
                                <li><strong>Sack Probability:</strong> 15-20%, leading to 5-10 yard loss.</li>
                                <li><strong>Field Goal Success:</strong> &lt; 35 yards: 80-90%, 35+ yards: 50%.</li>
                                <li><strong>Special Plays:</strong> 50% chance of significant gain or loss.</li>
                            </ul>

                            <p className="text-xs sm:text-sm leading-relaxed text-zinc-300 mt-4">
                                The simulation is balanced to ensure fairness and excitement, with every game outcome being random and independent.
                            </p>

                            <p className="text-xs sm:text-sm leading-relaxed text-zinc-300 mt-4">
                                <strong>Game Duration:</strong> Each simulated game lasts approximately <strong>12 real-time minutes</strong>, with 240 plays taking place over four quarters. Each play takes 3 seconds in real-time.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SportsAnalysisButton;

import React from 'react';
import { Radio } from 'lucide-react';

interface CommentaryProps {
    commentary: string[];
}

const Commentary: React.FC<CommentaryProps> = ({ commentary }) => {
    return (
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 w-full p-3 sm:p-4 rounded-xl shadow-lg border border-zinc-700">
            <div className="flex items-center justify-center mb-2 animate-pulse">
                <Radio className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-500" />
                <span className="text-md sm:text-lg md:text-xl font-bold text-zinc-300">Live Commentary</span>
            </div>
            <div className="space-y-2 h-32 sm:h-40 md:h-48 overflow-y-auto text-xs sm:text-sm md:text-base">
                {commentary.map((comment, index) => (
                    <p key={index} className="animate-fadeIn">{comment}</p>
                ))}
            </div>
        </div>
    );
};

export default Commentary;

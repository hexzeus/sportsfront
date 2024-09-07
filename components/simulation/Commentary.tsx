import React, { useRef, useEffect } from 'react';
import { Radio, Volume2 } from 'lucide-react';

interface CommentaryProps {
    commentary: string[];
}

const Commentary: React.FC<CommentaryProps> = ({ commentary }) => {
    const commentaryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (commentaryRef.current) {
            commentaryRef.current.scrollTop = commentaryRef.current.scrollHeight;
        }
    }, [commentary]);

    return (
        <div className="bg-gradient-to-r from-black via-gray-900 to-black w-full p-3 sm:p-4 rounded-lg shadow-md border-t-4 border-b-4 border-yellow-500">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                    <Radio className="text-red-600 w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                    <span className="text-sm sm:text-lg font-semibold text-yellow-400 uppercase tracking-wider animate-pulse">
                        Live Commentary
                    </span>
                </div>
                <Volume2 className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <div
                ref={commentaryRef}
                className="h-32 sm:h-40 overflow-y-auto text-xs sm:text-sm text-gray-300 space-y-2 pr-2 custom-scrollbar"
            >
                {commentary.map((comment, index) => (
                    <p
                        key={index}
                        className="leading-snug sm:leading-normal bg-gray-800 bg-opacity-50 p-2 rounded-md border-l-4 border-yellow-500 shadow-sm"
                    >
                        {comment}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default Commentary;

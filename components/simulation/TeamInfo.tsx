import React from 'react';
import Image from 'next/image';

interface Team {
    name: string;
    abbreviation: string;
    color: string;
    logo: string;
}

interface TeamInfoProps {
    team: Team | null;
    timeoutsLeft: number;
    side: 'home' | 'away';
}

const TeamInfo: React.FC<TeamInfoProps> = ({ team, timeoutsLeft, side }) => {
    if (!team) return null;

    return (
        <div className="flex flex-col items-center text-center">
            <Image
                src={team.logo}
                alt={`${team.name} logo`}
                width={80}  // Increased size for better visibility on larger screens
                height={80}
                className="object-contain mb-2 sm:mb-3 md:mb-4 lg:mb-5"
            />
            <span
                className={`text-${side === 'home' ? 'red' : 'orange'}-500 font-bold sm:text-lg md:text-xl lg:text-2xl`}
                style={{ color: team.color }}
            >
                {team.abbreviation}
            </span>
            <span className="text-xs sm:text-sm md:text-base text-zinc-400 group relative mt-1">
                TO: {timeoutsLeft}
                {/* Hover tooltip with timeouts remaining */}
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs md:text-sm rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Timeouts remaining
                </span>
            </span>
        </div>
    );
};

export default TeamInfo;

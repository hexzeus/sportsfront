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
        <div className="flex flex-col items-center">
            <Image
                src={team.logo}
                alt={`${team.name} logo`}
                width={64}
                height={64}
                className="object-contain mb-2"
            />
            <span
                className={`text-${side === 'home' ? 'red' : 'orange'}-500 animate-pulse`}
                style={{ color: team.color }}
            >
                {team.abbreviation}
            </span>
            <span className="text-xs text-zinc-400 group relative">
                TO: {timeoutsLeft}
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Timeouts remaining
                </span>
            </span>
        </div>
    );
};

export default TeamInfo;
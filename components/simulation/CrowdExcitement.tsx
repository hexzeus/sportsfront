import React from 'react';
import { Users } from 'lucide-react';

interface CrowdExcitementProps {
    crowdExcitement: number;
}

const CrowdExcitement: React.FC<CrowdExcitementProps> = ({ crowdExcitement }) => {
    const getExcitementColor = () => {
        if (crowdExcitement < 30) return 'text-red-500';
        if (crowdExcitement < 60) return 'text-yellow-500';
        return 'text-green-500';
    };

    return (
        <div className="flex items-center justify-center text-xs sm:text-sm space-x-2">
            <Users className={`w-3 h-3 sm:w-4 sm:h-4 ${getExcitementColor()}`} />
            <span className="font-bold text-gray-300">Crowd Excitement:</span>
            <span className={getExcitementColor()}>{Math.round(crowdExcitement)}%</span>
        </div>
    );
};

export default CrowdExcitement;

import React from 'react';
import { Cloud, Sun, CloudRain, Wind, Snowflake } from 'lucide-react';

interface WeatherInfoProps {
    weather: string;
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({ weather }) => {
    const getWeatherIcon = () => {
        switch (weather.toLowerCase()) {
            case 'clear':
                return <Sun className="w-5 h-5 sm:w-6 sm:h-6 mr-1 text-yellow-400" />;
            case 'cloudy':
                return <Cloud className="w-5 h-5 sm:w-6 sm:h-6 mr-1 text-gray-400" />;
            case 'rainy':
                return <CloudRain className="w-5 h-5 sm:w-6 sm:h-6 mr-1 text-blue-400" />;
            case 'windy':
                return <Wind className="w-5 h-5 sm:w-6 sm:h-6 mr-1 text-teal-400" />;
            case 'snowy':
                return <Snowflake className="w-5 h-5 sm:w-6 sm:h-6 mr-1 text-white" />;
            default:
                return <Sun className="w-5 h-5 sm:w-6 sm:h-6 mr-1 text-yellow-400" />;
        }
    };

    return (
        <div className="flex items-center justify-center text-xs sm:text-sm lg:text-base text-blue-400">
            {getWeatherIcon()}
            <span>{weather}</span>
        </div>
    );
};

export default WeatherInfo;

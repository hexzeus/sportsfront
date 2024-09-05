import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Skull, Flame, Zap, DollarSign, TrendingUp, Award } from 'lucide-react';

interface IntroPageProps {
    onComplete: () => void;
}

const IntroPage: React.FC<IntroPageProps> = ({ onComplete }) => {
    const [animated, setAnimated] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);

    useEffect(() => {
        setAnimated(true);

        const timer = setTimeout(() => {
            onComplete();
        }, 6000);

        const interval = setInterval(() => {
            setLoadingProgress((prev) => (prev < 100 ? prev + 1 : 100));
        }, 60);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [onComplete]);

    const iconClasses = "w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-gray-400 transition-all duration-300 ease-in-out transform hover:scale-110 hover:text-blue-400";

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-black via-blue-900 to-gray-800"></div>
                <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <rect width="50" height="50" fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1.5" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-gray-700/30"></div>
            </div>

            <div className="relative z-10 text-center space-y-4 sm:space-y-6 transform transition-all duration-1000 ease-out px-4 max-w-screen-md mx-auto">
                <div className="relative mx-auto w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 mb-6 sm:mb-8 animate-pulse-logo">
                    <Image
                        src="/file.png"
                        alt="Lock and Hammer Picks Logo"
                        fill
                        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-contain drop-shadow-2xl"
                    />
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-steel-gray to-gray-200 uppercase tracking-tight drop-shadow-3xl relative inline-block" style={{ fontFamily: 'Impact, sans-serif' }}>
                    Lock & Hammer
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-steel-gray to-gray-200 transform scale-x-0 transition-transform duration-1000 ease-in-out origin-left" style={{ animation: 'expandWidth 2s forwards' }}></span>
                </h1>

                <p className="text-lg sm:text-xl md:text-2xl text-gray-300 font-bold tracking-wide leading-tight" style={{ fontFamily: 'Arial Black, sans-serif' }}>
                    {['DOMINATE', 'CRUSH', 'CONQUER'].map((word, index) => (
                        <span key={word} className="inline-block mx-1" style={{ animation: `fadeIn 0.5s ${index * 0.2}s forwards`, opacity: 0 }}>
                            <span className={`text-${index === 0 ? 'blue' : index === 1 ? 'steel' : 'gray'}-400`}>{word}</span>
                            {index < 2 && '.'}
                        </span>
                    ))}
                </p>

                <div className="flex justify-center space-x-2 sm:space-x-4 mb-4 sm:mb-6">
                    {[Skull, Flame, Zap, DollarSign, TrendingUp, Award].map((Icon, index) => (
                        <Icon
                            key={index}
                            className={`${iconClasses} ${animated ? 'animate-float' : ''}`}
                            style={{ animationDelay: `${index * 0.2}s` }}
                        />
                    ))}
                </div>

                <div className="mt-6 sm:mt-8 w-full max-w-xs sm:max-w-md mx-auto">
                    <div className="bg-gray-800 h-3 sm:h-4 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-400 via-steel-500 to-gray-300 transition-all duration-300 ease-out"
                            style={{ width: `${loadingProgress}%` }}
                        ></div>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-300 mt-2" style={{ fontFamily: 'Impact, sans-serif' }}>
                        {loadingProgress}%
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes expandWidth {
                    to { transform: scaleX(1); }
                }
                @keyframes fadeIn {
                    to { opacity: 1; }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                .animate-pulse-logo {
                    animation: pulse 3s ease-in-out infinite, float 6s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default IntroPage;
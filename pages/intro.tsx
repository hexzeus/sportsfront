import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Lock, Hammer, Trophy } from 'lucide-react';

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

    const iconClasses =
        "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-gray-400 transition-all duration-500 ease-in-out transform hover:scale-110 hover:text-blue-400";

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Updated background gradient to match HomePage */}
                <div className="absolute inset-0 bg-gradient-to-br from-black via-dark-blue to-dark-gray h-full"></div>
                {/* SVG Grid Pattern */}
                <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
                    <pattern id="sportsGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                        <rect width="50" height="50" fill="none" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#sportsGrid)" />
                </svg>
                {/* Overlay to match HomePage */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 via-transparent to-slate-900/30 h-full"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center space-y-4 sm:space-y-6 transform transition-all duration-1000 ease-out px-4 max-w-screen-md mx-auto">
                {/* Logo */}
                <div className="relative mx-auto w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 mb-6 sm:mb-8 animate-pulse-logo">
                    <Image
                        src="/file.png"
                        alt="Lock and Hammer Picks Logo"
                        fill
                        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-contain drop-shadow-2xl"
                    />
                </div>

                {/* Title */}
                <h1
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-steel-gray to-gray-200 uppercase tracking-tight drop-shadow-3xl shadow-black transform-gpu perspective-1000 transition duration-500 ease-in-out"
                    style={{
                        fontFamily: 'Impact, sans-serif',
                        textShadow: '3px 3px 20px rgba(0, 0, 0, 0.9), -3px -3px 20px rgba(0, 0, 0, 0.6)',
                        letterSpacing: '-0.07em',
                    }}
                >
                    Lock & Hammer
                    <span className="block h-1 w-full bg-gradient-to-r from-blue-400 via-steel-gray to-gray-200 mt-3"></span>
                </h1>

                {/* Subtitle */}
                <p
                    className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 font-bold tracking-wide leading-tight max-w-screen-sm md:max-w-screen-md"
                    style={{ fontFamily: 'Arial Black, sans-serif' }}
                >
                    <span className="text-blue-400">DOMINATE.</span>{' '}
                    <span className="text-steel-gray">CRUSH.</span>{' '}
                    <span className="text-gray-200">CONQUER.</span>
                </p>

                {/* Icons */}
                <div className="flex justify-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                    {[Lock, Hammer, Trophy].map((Icon, index) => (
                        <Icon
                            key={index}
                            className={`${iconClasses} ${animated ? 'animate-pulse' : ''}`}
                            style={{ animationDelay: `${index * 150}ms` }}
                        />
                    ))}
                </div>

                {/* Loading Progress Bar */}
                <div className="mt-6 sm:mt-8 w-full max-w-xs sm:max-w-md mx-auto">
                    <div className="bg-gray-800 h-3 sm:h-4 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-400 via-steel-gray to-gray-200 transition-all duration-300 ease-out"
                            style={{ width: `${loadingProgress}%` }}
                        ></div>
                    </div>
                    <p
                        className="text-xl sm:text-2xl font-bold text-gray-300 mt-2"
                        style={{ fontFamily: 'Impact, sans-serif' }}
                    >
                        {loadingProgress}%
                    </p>
                </div>
            </div>

            {/* Custom CSS */}
            <style jsx>{`
                .animate-pulse-logo {
                    animation: pulse 3s ease-in-out infinite, float 6s ease-in-out infinite;
                }
                @keyframes pulse {
                    0%,
                    100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.7;
                    }
                }
                @keyframes float {
                    0% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                    100% {
                        transform: translateY(0px);
                    }
                }
            `}</style>
        </div>
    );
};

export default IntroPage;

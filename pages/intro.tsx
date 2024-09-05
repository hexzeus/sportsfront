import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Skull, Flame, Zap, DollarSign, TrendingUp, Award } from 'lucide-react';

const IntroPage = () => {
    const [animated, setAnimated] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const router = useRouter();

    useEffect(() => {
        setAnimated(true);
        localStorage.setItem('visitedIntro', 'true');

        const timer = setTimeout(() => {
            router.push('/');
        }, 6000);

        const interval = setInterval(() => {
            setLoadingProgress(prev => (prev < 100 ? prev + 1 : 100));
        }, 60);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [router]);

    const iconClasses = "w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-gray-300 transition-all duration-300 ease-in-out transform hover:scale-110 hover:text-red-500";

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden">
            {/* Enhanced Rustic Sports Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-800 to-zinc-700"></div>
                <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                    <filter id="noise">
                        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                        <feColorMatrix type="saturate" values="0" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noise)" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/40 via-transparent to-red-700/20"></div>
                <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-center space-y-4 sm:space-y-6 transform transition-all duration-1000 ease-out px-4 max-w-screen-md mx-auto">
                {/* Dynamic Logo */}
                <div className="relative mx-auto w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 mb-6 sm:mb-8 animate-pulse-logo">
                    <Image
                        src="/file.png"
                        alt="Lock and Hammer Picks Logo"
                        fill
                        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-contain drop-shadow-2xl"
                    />
                </div>

                {/* Title with animated underline */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-700 via-gray-700 to-steel-500 uppercase tracking-tighter drop-shadow-md relative inline-block" style={{ fontFamily: 'Impact, sans-serif' }}>
                    Lock & Hammer
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-700 via-gray-700 to-steel-500 transform scale-x-0 transition-transform duration-1000 ease-in-out origin-left" style={{ animation: 'expandWidth 2s forwards' }}></span>
                </h1>

                {/* Subtitle with staggered fade-in */}
                <p className="text-lg sm:text-xl md:text-2xl text-gray-400 font-bold tracking-wide leading-tight" style={{ fontFamily: 'Arial Black, sans-serif' }}>
                    {['DOMINATE', 'CRUSH', 'CONQUER'].map((word, index) => (
                        <span key={word} className="inline-block mx-1" style={{ animation: `fadeIn 0.5s ${index * 0.2}s forwards`, opacity: 0 }}>
                            <span className={`text-${index === 0 ? 'red' : index === 1 ? 'gray' : 'steel'}-500`}>{word}</span>
                            {index < 2 && '.'}
                        </span>
                    ))}
                </p>

                {/* Icon Animation */}
                <div className="flex justify-center space-x-2 sm:space-x-4 mb-4 sm:mb-6">
                    {[Skull, Flame, Zap, DollarSign, TrendingUp, Award].map((Icon, index) => (
                        <Icon
                            key={index}
                            className={`${iconClasses} ${animated ? 'animate-float' : ''}`}
                            style={{ animationDelay: `${index * 0.2}s` }}
                        />
                    ))}
                </div>

                {/* Tagline with typing effect */}
                <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mt-4 sm:mt-6 tracking-wide font-bold opacity-90" style={{ fontFamily: 'Arial Black, sans-serif' }}>
                    <span className="inline-block whitespace-nowrap overflow-hidden border-r-4 border-red-700" style={{ animation: 'typing 3.5s steps(40, end), blink-caret .75s step-end infinite' }}>
                        Unleashing Raw Sports Betting Power
                    </span>
                </p>

                {/* Loading Bar */}
                <div className="mt-6 sm:mt-8 w-full max-w-xs sm:max-w-md mx-auto">
                    <div className="bg-gray-800 h-3 sm:h-4 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-red-700 via-gray-700 to-steel-500 transition-all duration-300 ease-out"
                            style={{ width: `${loadingProgress}%` }}
                        ></div>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-300 mt-2" style={{ fontFamily: 'Impact, sans-serif' }}>
                        {loadingProgress}%
                    </p>
                </div>
            </div>

            {/* Enhanced Overlay Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40"></div>
                <div className="absolute inset-0 bg-[url('/path/to/subtle-texture.png')] opacity-5"></div>
            </div>

            {/* CSS for animations */}
            <style jsx>{`
                @keyframes expandWidth {
                    to { transform: scaleX(1); }
                }
                @keyframes fadeIn {
                    to { opacity: 1; }
                }
                @keyframes typing {
                    from { width: 0 }
                    to { width: 100% }
                }
                @keyframes blink-caret {
                    from, to { border-color: transparent }
                    50% { border-color: red; }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                @keyframes pulse {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                }
                .animate-pulse-logo {
                    animation: pulse 3s ease-in-out infinite, float 6s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default IntroPage;

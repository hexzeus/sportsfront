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
        document.cookie = "visitedIntro=true; path=/";
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

    const iconClasses = "w-12 h-12 sm:w-16 sm:h-16 text-zinc-300 transition-all duration-300 ease-in-out transform hover:scale-110 hover:text-red-500";

    return (
        <div className="fixed inset-0 z-50 bg-zinc-900 flex flex-col items-center justify-center overflow-hidden">
            {/* Enhanced Badass Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-800"></div>
                <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                    <filter id="noise">
                        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                        <feColorMatrix type="saturate" values="0" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noise)" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-t from-red-900/20 via-transparent to-orange-700/20"></div>
                <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-center space-y-6 transform transition-all duration-1000 ease-out px-4 max-w-screen-lg mx-auto">
                {/* Logo */}
                <div className="relative mx-auto w-40 h-40 sm:w-52 sm:h-52 mb-8">
                    <Image
                        src="/file.png"
                        alt="Lock and Hammer Picks Logo"
                        fill
                        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-contain drop-shadow-2xl animate-fadeIn"
                    />
                </div>

                {/* Title with animated underline */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 uppercase tracking-tighter drop-shadow-glow relative inline-block" style={{ fontFamily: 'Impact, sans-serif' }}>
                    Lock & Hammer
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 transform scale-x-0 transition-transform duration-1000 ease-in-out origin-left" style={{ animation: 'expandWidth 2s forwards' }}></span>
                </h1>

                {/* Subtitle with staggered fade-in */}
                <p className="text-xl sm:text-2xl md:text-3xl text-zinc-300 font-bold tracking-wide leading-tight" style={{ fontFamily: 'Arial Black, sans-serif' }}>
                    {['DOMINATE', 'CRUSH', 'CONQUER'].map((word, index) => (
                        <span key={word} className="inline-block mx-1" style={{ animation: `fadeIn 0.5s ${index * 0.2}s forwards`, opacity: 0 }}>
                            <span className={`text-${index === 0 ? 'red' : index === 1 ? 'orange' : 'yellow'}-500`}>{word}</span>
                            {index < 2 && '.'}
                        </span>
                    ))}
                </p>

                {/* Enhanced Icon Animation */}
                <div className="flex justify-center space-x-4 mb-6">
                    {[Skull, Flame, Zap, DollarSign, TrendingUp, Award].map((Icon, index) => (
                        <Icon
                            key={index}
                            className={`${iconClasses} ${animated ? 'animate-float' : ''}`}
                            style={{ animationDelay: `${index * 0.2}s` }}
                        />
                    ))}
                </div>

                {/* Tagline with typing effect */}
                <p className="text-xl sm:text-2xl md:text-3xl text-zinc-400 mt-6 tracking-wide font-bold opacity-90" style={{ fontFamily: 'Arial Black, sans-serif' }}>
                    <span className="inline-block whitespace-nowrap overflow-hidden border-r-4 border-orange-500" style={{ animation: 'typing 3.5s steps(40, end), blink-caret .75s step-end infinite' }}>
                        Unleashing Raw Sports Betting Power
                    </span>
                </p>

                {/* Pro Loading Bar */}
                <div className="mt-8 w-full max-w-md mx-auto">
                    <div className="bg-zinc-800 h-4 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 transition-all duration-300 ease-out"
                            style={{ width: `${loadingProgress}%` }}
                        ></div>
                    </div>
                    <p className="text-2xl font-bold text-zinc-300 mt-2" style={{ fontFamily: 'Impact, sans-serif' }}>
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
                    50% { border-color: orange; }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
            `}</style>
        </div>
    );
};

export default IntroPage;

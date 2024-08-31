import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Lock, Hammer, Target, Trophy, Zap, Flame } from 'lucide-react';

const IntroPage = () => {
    const [animated, setAnimated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setAnimated(true);
        document.cookie = "visitedIntro=true; path=/";
        const timer = setTimeout(() => {
            router.push('/');
        }, 6000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-black to-blue-900 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 flex justify-center items-center overflow-hidden">
                <div className="absolute w-full h-full bg-[url('/noise.png')] opacity-10"></div>
                <div className="absolute w-96 h-96 rounded-full bg-blue-800 opacity-20 blur-3xl animate-pulse"></div>
                <div className="absolute w-72 h-72 bg-gradient-to-r from-gray-800 to-gray-900 opacity-30 rounded-full blur-2xl animate-spin-slow"></div>
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-gradient-to-r from-gray-700 to-gray-800 opacity-20 rounded-full blur-3xl animate-pulse"></div>
            </div>

            <div className="relative z-10 text-center space-y-8 transform transition-all duration-1000 ease-out">
                <div className="flex justify-center space-x-8 mb-8">
                    <Lock className="w-16 h-16 text-blue-500 animate-pulse" />
                    <Hammer className="w-16 h-16 text-gray-300 animate-pulse delay-100" />
                    <Target className="w-16 h-16 text-blue-500 animate-pulse delay-200" />
                    <Trophy className="w-16 h-16 text-gray-300 animate-pulse delay-300" />
                </div>

                <h1 className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-gray-300 to-blue-500 mt-4 animate-pulse uppercase tracking-widest drop-shadow-xl">
                    Lock and Hammer Picks
                </h1>

                <p className="text-2xl md:text-4xl text-gray-300 font-bold tracking-wide leading-relaxed">
                    Dominant Analysis. Ruthless Precision. Unbeatable Results.
                </p>

                <div className="flex justify-center items-center space-x-6">
                    <Zap className="w-12 h-12 text-blue-500 animate-pulse" />
                    <Flame className="w-12 h-12 text-blue-500 animate-pulse delay-150" />
                    <Zap className="w-12 h-12 text-blue-500 animate-pulse delay-300" />
                </div>

                <p className="text-xl md:text-3xl text-blue-500 mt-8 tracking-wider font-mono font-bold opacity-90 animate-pulse">
                    Unleashing the Power of Sports Betting Mastery...
                </p>
            </div>

            <div className="absolute inset-0 z-[-1] overflow-hidden">
                <div className="absolute top-1/3 left-1/4 w-64 h-64 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-gradient-to-r from-blue-900 to-gray-800 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-64 h-64 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-gradient-to-r from-gray-800 to-blue-900 rounded-full blur-3xl opacity-30 animate-spin-slow"></div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent"></div>
        </div>
    );
};

export default IntroPage;

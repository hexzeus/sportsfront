import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

const IntroPage: React.FC = () => {
    const [animated, setAnimated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setAnimated(true);

        // Set a cookie to indicate that the user has visited the intro page
        document.cookie = "visitedIntro=true; path=/";

        const timer = setTimeout(() => {
            router.push('/'); // Redirect to the homepage after the intro
        }, 5000); // 5 seconds delay for the intro animation

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 flex justify-center items-center overflow-hidden">
                <div className="absolute w-96 h-96 rounded-full bg-falcons-red opacity-20 blur-3xl animate-slow-pulse"></div>
                <div className="absolute w-72 h-72 bg-gradient-to-r from-yellow-500 to-red-600 opacity-30 rounded-full blur-2xl animate-spin-slow"></div>
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-20 rounded-full blur-3xl animate-pulse"></div>
            </div>

            <div className="relative z-10 text-center space-y-6">
                <Image
                    src="/file.png"
                    alt="Lock and Hammer Picks Logo"
                    width={150}
                    height={150}
                    className="animate-pulse drop-shadow-2xl"
                />
                <h1 className="text-6xl md:text-8xl font-extrabold text-falcons-red mt-4 animate-glow uppercase tracking-widest drop-shadow-xl">
                    Falcons Rise Up
                </h1>
                <p className="text-xl md:text-3xl text-gray-300 font-semibold tracking-wide leading-relaxed">
                    Every Play. Every Bet. Every Victory. Let’s turn passion into power.
                </p>

                <p className="text-lg text-gray-400 mt-6 tracking-wider font-mono opacity-90 animate-blink">
                    Loading...
                </p>
            </div>

            <div className="absolute inset-0 z-[-1] overflow-hidden">
                <div className="absolute top-1/3 left-1/4 w-40 h-40 sm:w-48 sm:h-48 md:w-60 md:h-60 bg-gradient-to-r from-falcons-red to-yellow-400 rounded-full blur-3xl opacity-40 animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-44 h-44 sm:w-56 sm:h-56 md:w-72 md:h-72 bg-gradient-to-r from-gray-800 to-black rounded-full blur-3xl opacity-40"></div>
            </div>
        </div>
    );
};

export default IntroPage;

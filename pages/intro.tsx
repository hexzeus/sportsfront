import { useEffect, useState } from 'react';
import Image from 'next/image';

const IntroPage: React.FC = () => {
    const [animated, setAnimated] = useState(false);
    const [returnDate, setReturnDate] = useState<string>("");

    useEffect(() => {
        setAnimated(true);

        // Calculate a date one week from now
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 50000);
        const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
        const formattedDate = futureDate.toLocaleDateString('en-US', options);

        setReturnDate(formattedDate);
    }, []);

    return (
        // Full screen covering container with award-winning design
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center overflow-hidden">
            {/* Floating animated elements for depth */}
            <div className="absolute inset-0 flex justify-center items-center overflow-hidden">
                <div className="absolute w-96 h-96 rounded-full bg-falcons-red opacity-10 blur-3xl animate-slow-pulse"></div>
                <div className="absolute w-72 h-72 bg-gradient-to-r from-yellow-500 to-red-600 opacity-30 rounded-full blur-2xl animate-spin-slow"></div>
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-20 rounded-full blur-3xl animate-pulse"></div>
            </div>

            {/* Main centered content */}
            <div className="relative z-10 text-center space-y-6">
                <Image
                    src="/falcon-logo.png"
                    alt="Atlanta Falcons Logo"
                    width={150}
                    height={150}
                    className="animate-pulse drop-shadow-2xl"
                />
                <h1 className="text-6xl md:text-8xl font-extrabold text-falcons-red mt-4 animate-glow uppercase tracking-widest drop-shadow-xl">
                    We&apos;ll Be Back Soon
                </h1>
                <p className="text-xl md:text-3xl text-gray-300 font-semibold tracking-wide leading-relaxed">
                    We&apos;re currently performing maintenance to make things even better for you.<br />
                    Stay tuned for our return.
                </p>

                {/* Subtle flickering animated text with dynamic date */}
                <p className="text-lg text-gray-400 mt-6 tracking-wider font-mono opacity-90 animate-blink">
                    Estimated return time: <span className="text-falcons-red font-bold">55:55 PM EST</span> on <span className="text-falcons-red font-bold">{returnDate}</span>
                </p>

                {/* Social Links or Placeholder */}
                <div className="mt-8 space-x-6">
                    <a
                        href="https://twitter.com/immutablehex"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-falcons-red hover:text-yellow-500 transition-colors duration-300 transform hover:scale-110"
                    >
                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 4.557a9.83 9.83 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724 9.864 9.864 0 0 1-3.127 1.195 4.916 4.916 0 0 0-8.38 4.482C7.688 8.095 4.067 6.13 1.64 3.161a4.822 4.822 0 0 0-.666 2.475 4.92 4.92 0 0 0 2.188 4.093 4.902 4.902 0 0 1-2.224-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.935 4.935 0 0 1-2.212.084c.623 1.947 2.432 3.368 4.576 3.406A9.868 9.868 0 0 1 0 19.54a13.933 13.933 0 0 0 7.548 2.212c9.142 0 14.307-7.721 13.995-14.646A9.936 9.936 0 0 0 24 4.557z" />
                        </svg>
                    </a>
                    <a
                        href="mailto:builtbyai@yahoo.com"
                        className="text-falcons-red hover:text-yellow-500 transition-colors duration-300 transform hover:scale-110"
                    >
                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12.713l11.994-7.259v13.166a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5.454L12 12.713zM23.994 4.246A1 1 0 0 0 23 4H1a1 1 0 0 0-.964.273L12 11.287l11.994-7.04z" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default IntroPage;

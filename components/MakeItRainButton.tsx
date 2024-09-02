import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, CloudRain } from 'lucide-react';

const moneyEmojis = ['💵', '💰', '💸', '🤑', '💲', '💳', '🏦', '💹'];

const EnhancedMakeItRainButton: React.FC = () => {
    const [raining, setRaining] = useState(false);
    const [buttonClicked, setButtonClicked] = useState(false);

    const startRain = useCallback(() => {
        setRaining(true);
        setButtonClicked(true);
        setTimeout(() => setRaining(false), 3000);
        setTimeout(() => setButtonClicked(false), 3500);
    }, []);

    return (
        <div className="relative">
            <motion.button
                onClick={startRain}
                disabled={buttonClicked}
                className={`
          group relative inline-flex items-center justify-center px-8 py-4 
          overflow-hidden text-lg sm:text-xl font-extrabold text-white uppercase 
          tracking-wider transition-all duration-300 ease-out rounded-full 
          shadow-lg focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-50
          ${buttonClicked
                        ? 'bg-green-500 animate-pulse'
                        : 'bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:from-green-500 hover:via-green-600 hover:to-green-700'
                    }
        `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <span className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 ease-out"></span>
                <span className="relative z-10 flex items-center space-x-3">
                    {buttonClicked ? (
                        <CloudRain className="w-7 h-7 text-white animate-bounce" />
                    ) : (
                        <DollarSign className="w-7 h-7 text-yellow-300 animate-pulse" />
                    )}
                    <span className="font-black tracking-widest">Make It Rain</span>
                </span>
                <motion.span
                    className="absolute inset-0 rounded-full"
                    initial={false}
                    animate={buttonClicked ? { boxShadow: '0 0 0 3px rgba(72, 187, 120, 0.4)' } : { boxShadow: '0 0 0 0px rgba(72, 187, 120, 0)' }}
                />
            </motion.button>

            <AnimatePresence>
                {raining && (
                    <div className="absolute inset-0 w-screen h-screen pointer-events-none overflow-hidden" style={{ top: '100%', left: '-50vw' }}>
                        {Array.from({ length: 100 }).map((_, index) => (
                            <motion.div
                                key={index}
                                className="absolute text-4xl sm:text-5xl md:text-6xl"
                                initial={{
                                    opacity: 0,
                                    y: -50,
                                    x: Math.random() * window.innerWidth,
                                    rotate: 0
                                }}
                                animate={{
                                    opacity: [0, 1, 1, 0],
                                    y: window.innerHeight,
                                    rotate: Math.random() * 360
                                }}
                                exit={{ opacity: 0 }}
                                transition={{
                                    duration: 2 + Math.random() * 1,
                                    ease: "easeOut",
                                    times: [0, 0.1, 0.9, 1]
                                }}
                            >
                                {moneyEmojis[Math.floor(Math.random() * moneyEmojis.length)]}
                            </motion.div>
                        ))}
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EnhancedMakeItRainButton;
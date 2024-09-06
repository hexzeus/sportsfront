import React from 'react';
import Image from 'next/image';

interface CoinTossAnimationProps {
    showCoinAnimation: boolean;
}

const CoinTossAnimation: React.FC<CoinTossAnimationProps> = ({ showCoinAnimation }) => {
    if (!showCoinAnimation) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="relative w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64">
                <Image
                    src="/coin.png"
                    alt="Coin Toss"
                    fill
                    sizes="(max-width: 640px) 128px, (max-width: 768px) 192px, 256px"
                    className="object-contain animate-coin-toss"
                />
            </div>
        </div>
    );
};

export default CoinTossAnimation;

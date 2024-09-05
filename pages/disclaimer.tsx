import Layout from '../components/layout';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Flame, AlertTriangle } from 'lucide-react';

export default function DisclaimerPage() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-zinc-900 via-black to-zinc-900 text-zinc-100 p-4 sm:p-6 md:p-8 lg:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-noise opacity-5"></div>
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-blue-800 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 bg-gradient-to-r from-gray-800 to-blue-900 rounded-full blur-3xl opacity-30 animate-spin-slow"></div>

            <motion.div
                className="bg-gradient-to-br from-zinc-900 to-black p-4 sm:p-6 md:p-8 lg:p-10 rounded-xl shadow-2xl max-w-xl sm:max-w-2xl md:max-w-3xl w-full mx-auto relative z-10 border border-blue-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
            >
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-gray-500 to-blue-700 mb-6 sm:mb-8 text-center uppercase drop-shadow-md tracking-wide" style={{ fontFamily: 'Impact, sans-serif' }}>
                    Disclaimer
                </h1>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <p className="text-sm sm:text-base md:text-lg leading-relaxed text-zinc-300 text-justify tracking-wider mb-4 sm:mb-6">
                        <AlertTriangle className="inline-block mr-2 text-yellow-500" size={20} />
                        The content provided on this site is for informational and entertainment purposes only. We do not offer any financial, investment, or
                        legal advice. Users should not rely on the content as a basis for making any financial or betting decisions.
                    </p>
                    <p className="text-sm sm:text-base md:text-lg leading-relaxed text-zinc-300 mt-4 sm:mt-6 text-justify tracking-wider">
                        By using this website, you acknowledge that any actions taken based on the information provided are at your own risk. We make no
                        guarantees regarding the accuracy or reliability of the information shared on the site.
                    </p>
                    <p className="text-sm sm:text-base md:text-lg leading-relaxed text-zinc-300 mt-4 sm:mt-6 text-justify tracking-wider">
                        The site and its owners are not responsible for any losses, liabilities, or damages arising from the use of the information provided
                        here. Your use of the website constitutes your agreement to this disclaimer.
                    </p>
                </motion.div>

                {/* Back to Home Button */}
                <motion.div
                    className="mt-8 sm:mt-10 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <Link href="/" passHref>
                        <motion.span
                            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-gray-600 text-zinc-100 text-md sm:text-lg font-bold py-3 px-6 sm:px-8 rounded-full shadow-xl hover:from-blue-700 hover:to-gray-700 transition-all duration-300 border-2 border-blue-700"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Flame className="mr-2" size={20} />
                            Back to Home
                        </motion.span>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}

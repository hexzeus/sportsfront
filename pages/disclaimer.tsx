import Layout from '../components/layout';
import Link from 'next/link';

export default function DisclaimerPage() {
    return (
        <Layout>
            <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-black via-gray-900 to-falcons-red text-white p-6 md:p-12">
                <div className="bg-gray-900 p-6 sm:p-8 md:p-12 rounded-xl shadow-2xl max-w-3xl w-full mx-auto transform transition-transform duration-500 hover:scale-105">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-falcons-red mb-8 text-center uppercase drop-shadow-md tracking-wide">
                        Disclaimer
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-300 text-justify sm:text-left tracking-wider">
                        The content provided on this site is for informational and entertainment purposes only. We do not offer any financial, investment, or
                        legal advice. Users should not rely on the content as a basis for making any financial or betting decisions.
                    </p>
                    <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-300 mt-6 text-justify sm:text-left tracking-wider">
                        By using this website, you acknowledge that any actions taken based on the information provided are at your own risk. We make no
                        guarantees regarding the accuracy or reliability of the information shared on the site.
                    </p>
                    <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-300 mt-6 text-justify sm:text-left tracking-wider">
                        The site and its owners are not responsible for any losses, liabilities, or damages arising from the use of the information provided
                        here. Your use of the website constitutes your agreement to this disclaimer.
                    </p>

                    {/* Back to Home Button */}
                    <div className="mt-10 text-center">
                        <Link href="/" passHref>
                            <span className="inline-block bg-gradient-to-r from-falcons-red to-falcons-silver text-white text-lg sm:text-xl font-bold py-3 px-8 sm:px-10 md:px-12 rounded-full shadow-xl hover:bg-gradient-to-r hover:from-red-700 hover:to-gray-500 hover:text-yellow-300 transform hover:scale-110 transition-transform duration-300 ease-in-out border-2 border-falcons-red">
                                Back to Home
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

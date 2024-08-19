import Layout from '../components/layout';
import Link from 'next/link';

export default function DisclaimerPage() {
    return (
        <Layout>
            <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-black via-gray-900 to-falcons-red text-white p-6 md:p-12">
                <div className="bg-gray-900 p-8 md:p-12 rounded-lg shadow-2xl max-w-3xl mx-auto">
                    <h1 className="text-5xl font-extrabold text-falcons-red mb-8 text-center uppercase">Disclaimer</h1>
                    <p className="text-lg leading-relaxed text-gray-300">
                        The content provided on this site is for informational and entertainment purposes only. We do not offer any financial, investment, or
                        legal advice. Users should not rely on the content as a basis for making any financial or betting decisions.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-300 mt-6">
                        By using this website, you acknowledge that any actions taken based on the information provided are at your own risk. We make no
                        guarantees regarding the accuracy or reliability of the information shared on the site.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-300 mt-6">
                        The site and its owners are not responsible for any losses, liabilities, or damages arising from the use of the information provided
                        here. Your use of the website constitutes your agreement to this disclaimer.
                    </p>

                    {/* Back to Home Button */}
                    <div className="mt-8 text-center">
                        <Link href="/" passHref>
                            <span className="inline-block bg-falcons-red text-white text-lg md:text-xl font-semibold py-3 px-8 md:px-10 rounded-lg shadow-md hover:bg-red-700 hover:text-yellow-300 transform hover:scale-105 transition-all">
                                Back to Home
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

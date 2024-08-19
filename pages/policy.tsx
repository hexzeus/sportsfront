import Layout from '../components/layout';
import Link from 'next/link';

export default function PolicyPage() {
    return (
        <Layout>
            <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-black via-gray-900 to-falcons-red text-white p-6 md:p-12">
                <div className="bg-gray-900 p-8 md:p-12 rounded-lg shadow-2xl max-w-3xl mx-auto">
                    <h1 className="text-5xl font-extrabold text-falcons-red mb-8 text-center uppercase">Privacy Policy</h1>
                    <p className="text-lg leading-relaxed text-gray-300">
                        This website does not collect, store, or process any personal information from its users. We do not require any registration, login,
                        or personal data for you to access the site&apos;s content or features. Your privacy is respected, and no identifiable data is collected
                        during your visit.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-300 mt-6">
                        By using this site, you acknowledge that no personal information is gathered, and as such, there are no concerns regarding data
                        collection, sharing, or usage. Your experience on this website is anonymous, and we do not engage in tracking or monitoring user activities.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-300 mt-6">
                        Please feel free to browse and enjoy the content without any worries about your privacy. We take pride in maintaining a secure and
                        anonymous browsing experience for all users.
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

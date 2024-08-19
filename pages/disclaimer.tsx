import Layout from '../components/layout';

export default function DisclaimerPage() {
    return (
        <Layout>
            <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-black via-gray-900 to-falcons-red text-white p-6 md:p-12">
                <div className="bg-gray-900 p-8 md:p-12 rounded-lg shadow-2xl max-w-3xl mx-auto">
                    <h1 className="text-5xl font-extrabold text-falcons-red mb-8 text-center uppercase">Disclaimer</h1>
                    <p className="text-lg leading-relaxed text-gray-300">
                        This site is for informational purposes only. It&apos;s important to understand that we do not offer financial advice.
                        Any betting or gambling decisions are the sole responsibility of the individual, and we cannot be held liable for any financial
                        losses incurred. Always bet responsibly and within your means.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-300 mt-6">
                        By using this site, you acknowledge that we are not responsible for any outcomes related to your betting activities. All information
                        provided on this site is intended for entertainment purposes only.
                    </p>
                </div>
            </div>
        </Layout>
    );
}

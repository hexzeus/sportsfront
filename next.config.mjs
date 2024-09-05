/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'alienreviewdb.s3.us-east-2.amazonaws.com',
                port: '',
                pathname: '/**',  // This allows any image path from this domain
            },
            {
                protocol: 'https',
                hostname: 'a.espncdn.com',  // ESPN images hostname
                port: '',
                pathname: '/**',  // This allows any image path from this domain
            },
        ],
    },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['https://alienreviewdb.s3.us-east-2.amazonaws.com/'], // Your actual S3 bucket domain
    },
};

export default nextConfig;

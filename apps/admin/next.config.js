/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['images.unsplash.com', 'via.placeholder.com', 'www.instagram.com', 'images.weserv.nl'],
    },
    transpilePackages: ['@bigbazar/types', '@bigbazar/validation', 'next-themes'],
    typescript: {
        ignoreBuildErrors: true,
    },
};

module.exports = nextConfig;

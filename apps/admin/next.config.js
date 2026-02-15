/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['images.unsplash.com', 'via.placeholder.com'],
    },
    transpilePackages: ['@bigbazar/types', '@bigbazar/validation', 'next-themes'],
};

module.exports = nextConfig;

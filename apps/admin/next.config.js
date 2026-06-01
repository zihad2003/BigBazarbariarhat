/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        unoptimized: true,
    },
    transpilePackages: ['@bigbazar/types', '@bigbazar/validation', 'next-themes'],
    typescript: {
        ignoreBuildErrors: true,
    },
};

module.exports = nextConfig;

import type { NextConfig } from 'next';
import path from 'path';

const withBundleAnalyzer =
  process.env.ANALYZE === 'true'
    ? require('@next/bundle-analyzer')({ enabled: true })
    : (config: NextConfig) => config;

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(__dirname, '../../'),
  devIndicators: false,

  // ─── Image Optimization ──────────────────────────────────────
  images: {
    loader: 'custom',
    loaderFile: './src/lib/cloudinary-loader.ts',
  },

  // ─── Performance ──────────────────────────────────────────────
  reactStrictMode: true,
  poweredByHeader: false, // Security: remove X-Powered-By header

  // ─── Caching Headers ──────────────────────────────────────────
  async headers() {
    return [
      {
        // Cache static assets aggressively
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache API responses for short duration
        source: '/api/products/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
      {
        // Cache category/search pages
        source: '/api/search/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=30, stale-while-revalidate=120',
          },
        ],
      },
      {
        // Security headers for all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  transpilePackages: ['@bigbazar/shared', '@bigbazar/ui'],

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ─── Webpack Optimizations ───────────────────────────────────
  webpack: (config, { isServer }) => {
    // Optimize client-side bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    return config;
  },

  // ─── Experimental Features ───────────────────────────────────
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@tanstack/react-query',
    ],
  },

  // ─── Turbopack Config ────────────────────────────────────────
  turbopack: {
    root: path.resolve(__dirname, '../../'),
  },
};

export default withBundleAnalyzer(nextConfig);

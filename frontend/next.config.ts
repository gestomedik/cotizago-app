import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
    unoptimized: isProduction,
  },

  // Production settings
  ...(isProduction && {
    output: 'export',
    basePath: '/cotizador_app',
    assetPrefix: '/cotizador_app/',
    trailingSlash: true,
  }),

  // Development settings
  ...(!isProduction && {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost/ELS/CotizaGO/api/:path*',
        },
      ];
    },
  }),

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

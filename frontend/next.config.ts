import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Permite todos los dominios HTTPS (usar con precaución)
      },
      {
        protocol: 'http',
        hostname: '**', // Permite todos los dominios HTTP (usar con precaución)
      }
    ],
  },
};

export default nextConfig;

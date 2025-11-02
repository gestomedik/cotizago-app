/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost/ELS/CotizaGO/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
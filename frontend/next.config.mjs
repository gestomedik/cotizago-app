/** @type {import('next').NextConfig} */

const isProduction = process.env.NODE_ENV === 'production';

const nextConfig = {
  // ✅ Output SOLO en producción
  ...(isProduction && { output: 'export' }),
  
  // ✅ BasePath SOLO en producción
  basePath: isProduction ? '/cotizador_app' : '',
  assetPrefix: isProduction ? '/cotizador_app/' : '',
  
  // ✅ Imágenes sin optimización SOLO en producción
  images: {
    unoptimized: isProduction,
  },
  
  // ✅ Trailing slash SOLO en producción
  trailingSlash: isProduction,
  
  // ✅ Rewrites SOLO en desarrollo
  ...(!isProduction && {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost/ELS/CotizaGO/api/:path*',
        },
      ]
    },
  }),
  
  // ✅ Ignorar errores en build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
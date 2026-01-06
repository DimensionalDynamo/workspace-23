import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export disabled for Vercel (Vercel handles SSR natively)
  // output: "export",

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Trailing slash for better compatibility with file:// protocol
  trailingSlash: true,



  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Allow cross-origin requests in dev mode (fixes CORS warning)
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://192.168.1.33:3000',
    'http://192.168.56.1:3000',
    'http://192.168.56.2:3000',
  ],
};

export default nextConfig;

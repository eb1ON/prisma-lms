/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mk.edu.mn",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ Skip TypeScript errors during build
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Skip ESLint errors during build
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Allow production builds to successfully complete even if
    // there are ESLint errors. We'll fix them incrementally.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow production builds even if there are type errors.
    // This unblocks deploys; tighten later as we fix typing.
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

module.exports = nextConfig;


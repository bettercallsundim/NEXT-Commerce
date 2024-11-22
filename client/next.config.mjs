/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Set this to true to ignore ESLint during builds.
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: "/about2",
        destination: "/",
      },
    ];
  },
};

export default nextConfig;

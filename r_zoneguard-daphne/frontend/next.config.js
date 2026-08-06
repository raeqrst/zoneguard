/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*', // Change 5000 if your Express backend runs on a different port
      },
    ];
  },
};

module.exports = nextConfig;
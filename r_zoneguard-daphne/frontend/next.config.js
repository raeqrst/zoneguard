/** @type {import('next').NextConfig} */
const nextConfig = {
<<<<<<< HEAD
=======
  reactStrictMode: true,
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
  async rewrites() {
    return [
      {
        source: '/api/:path*',
<<<<<<< HEAD
        destination: 'http://localhost:5000/api/:path*',
=======
        destination: 'http://localhost:5000/api/:path*', // Change 5000 if your Express backend runs on a different port
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
      },
    ];
  },
};

module.exports = nextConfig;
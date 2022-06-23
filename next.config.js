/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/guilds',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig

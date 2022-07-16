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
      {
        source: '/:uuid([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})',
        destination: '/short/:uuid',
        permanent: true,
      },
      {
        source: '/:uuid([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}).svg',
        destination: '/short/:uuid.svg',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;

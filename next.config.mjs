/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  basePath: '/personal-calendar',
  async redirects() {
    return [
      {
        source: '/personal-calander',
        destination: '/personal-calendar',
        permanent: true,
        basePath: false,
      },
    ];
  },
};

export default nextConfig;

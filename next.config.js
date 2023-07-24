/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: true,
  },
  images: {
    domains: ['uploadthing.com'],
  },
};

module.exports = nextConfig;

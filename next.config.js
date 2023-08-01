/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: true,
  },
  images: {
    domains: ['uploadthing.com', 'lh3.googleusercontent.com'],
  },
};

module.exports = nextConfig;

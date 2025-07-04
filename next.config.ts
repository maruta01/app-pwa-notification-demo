import withPWA from 'next-pwa';

// Your regular Next.js configuration object
const nextConfig = {
  reactStrictMode: true,
};

// PWA configuration
const pwaConfig = {
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
};

export default withPWA(pwaConfig)(nextConfig);
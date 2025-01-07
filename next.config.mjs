/** @type {import('next').NextConfig} */
const nextConfig = {
  // Set environment variables for your app
  env: {
    NEXT_PUBLIC_FLESPI_TOKEN: process.env.NEXT_PUBLIC_FLESPI_TOKEN,
  },

  // Disable ESLint during the build process to avoid linting errors blocking deployments
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

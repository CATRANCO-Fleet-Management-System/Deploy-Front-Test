/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Correctly define output
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.com",
        port: "", // Leave empty if no specific port is needed
        pathname: "/**/*", // Correct wildcard pattern
      },
    ],
  },
};

export default nextConfig;

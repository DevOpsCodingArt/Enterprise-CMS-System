import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow accessing the Next.js development server from other devices on your local network
  allowedDevOrigins: [
    "192.168.1.6",
    "192.168.1.6:3000",
    "192.168.*",
    "10.*",
    "localhost:3000",
  ],
};

export default nextConfig;

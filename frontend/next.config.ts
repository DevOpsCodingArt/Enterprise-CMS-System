import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow accessing the Next.js development server from other devices on your local network
  allowedDevOrigins: [
    "192.168.1.7",
    "192.168.1.7:3000",
    "192.168.1.6",
    "192.168.1.6:3000",
    "192.168.1.*",
    "192.168.*",
    "10.*",
    "localhost:3000",
    "localhost",
  ],
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "http://localhost:4000/api/v1/:path*",
      },
    ];
  },
};


export default nextConfig;

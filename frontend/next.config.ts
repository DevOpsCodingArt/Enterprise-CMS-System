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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: http://localhost:4000; connect-src 'self' http://localhost:4000 ws://localhost:4000; frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

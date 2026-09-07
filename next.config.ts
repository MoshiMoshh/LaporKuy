import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow mobile browser on local network to access dev resources (HMR, etc.)
  allowedDevOrigins: ['192.168.100.4'],

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

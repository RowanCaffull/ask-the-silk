import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "36group.co.uk",
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "http://10.0.0.231:8082",
        "http://localhost:3002"
      ],
    },
  },
};

export default nextConfig;
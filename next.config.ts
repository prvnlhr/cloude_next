import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/cloude/home/dashboard",
        permanent: true, // Set to false for temporary redirect
      },
    ];
  },
};

export default nextConfig;

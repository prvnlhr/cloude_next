import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qlnareoslkcshynvtnrl.supabase.co",
        pathname: "/storage/v1/object/sign/**",
      },
    ],
  },
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

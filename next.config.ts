import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imgs.search.brave.com",
        pathname: "/**", // Allow all paths under this hostname
      },
    ],

  }
};

export default nextConfig;

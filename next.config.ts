import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  transpilePackages: ["@radix-ui/react-tabs"],
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  experimental:{
    serverActions:{
      bodySizeLimit: 8 * 1024 * 1024, // 8MB
    }
  }
  
  /* config options here */
};

export default nextConfig;

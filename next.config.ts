import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  transpilePackages: ["@radix-ui/react-tabs"],
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This will ignore TypeScript errors during the build process
    // Note: This is not recommended for long-term use
    ignoreBuildErrors: true,
  },
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

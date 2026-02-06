import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Increase to 10MB for file uploads
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "viper.monirspace.com",
      },
      {
        protocol: "https",
        hostname: "kossti.s3.ap-southeast-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com", // Allow all S3 buckets
      },
    ],
    formats: ["image/avif", "image/webp"], // Use modern formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Optimize for common devices
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Icon sizes
    minimumCacheTTL: 86400, // Cache images for 24 hours (product images rarely change)
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Add security and performance headers
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
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ];
  },

  // Reduce bundle size
  modularizeImports: {
    "react-icons": {
      transform: "react-icons/{{member}}",
    },
  },

  // Output standalone for optimal deployment
  output: "standalone",
};

export default nextConfig;

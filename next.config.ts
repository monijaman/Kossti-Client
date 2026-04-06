import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Optimize production builds
  compress: true, // Enable gzip compression
  
  // Add performance headers
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Increase to 10MB for file uploads
    },
    optimizePackageImports: ['@mui/icons-material', 'lucide-react'], // Tree-shake large icon libraries
  },
  
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "gocritserver-production.up.railway.app",
      },
      {
        protocol: "http",
        hostname: "localhost:8080",
      },
      {
        protocol: "https",
        hostname: "gocritserver-production.up.railway.app",
        port: "8080",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "viper.monirspace.com",
      },
      {
        protocol: "https",
        hostname: "kossti.s3.ap-southeast-1.amazonaws.com",
        pathname: "/product-images/**",
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

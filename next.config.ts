import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "127.0.0.1",
      "img.youtube.com",
      "localhost",
      "localhost:8080",
      "viper.monirspace.com",
    ], // Add your local domains here
  },
};

export default nextConfig;

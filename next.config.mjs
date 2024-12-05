/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactRoot: true, // Enable React 19 features
  },
  // i18n: {
  //   locales: ['en', 'bn', 'fr', 'es', 'de'], // Add your supported locales here
  //   defaultLocale: 'en', // Set your default locale
  //   localeDetection: false, // Automatically detect user locale (default is true)
  // },
  images: {
    domains: ['127.0.0.1', 'img.youtube.com', 'localhost', 'viper.monirspace.com'], // Add your local domains here
  },
};

export default nextConfig;

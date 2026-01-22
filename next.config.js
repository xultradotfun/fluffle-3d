/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["three"],
  env: {
    // Backend API URL configuration - Next.js needs this for build-time injection
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  },
  webpack: (config, { isServer }) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });
    
    // Ignore optional wallet connector dependencies
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "porto": false,
      "porto/internal": false,
      "@base-org/account": false,
      "@coinbase/wallet-sdk": false,
      "@gemini-wallet/core": false,
      "@metamask/sdk": false,
      "@react-native-async-storage/async-storage": false,
      "pino-pretty": false,
    };
    
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;

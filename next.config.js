/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["three"],
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });
    return config;
  },
  images: {
    domains: ["fluffle-traits.b-cdn.net"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "spark-list-d20.notion.site",
        port: "",
        pathname: "/image/**",
      },
    ],
  },
};

module.exports = nextConfig;

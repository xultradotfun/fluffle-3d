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
    domains: [
      "fluffle-traits.b-cdn.net",
      "mega-eco.b-cdn.net",
      "mega-bingo.b-cdn.net",
      "firebasestorage.googleapis.com",
      "testnet-bff.rarible.fun",
      "testnet.rarible.fun",
      "ipfs.raribleuserdata.com",
      "wlbl-s3.wlbl.xyz",
    ],
  },
};

module.exports = nextConfig;

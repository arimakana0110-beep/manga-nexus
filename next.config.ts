import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@consumet/extensions'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's4.anilist.co',
      },
      {
        protocol: 'https',
        hostname: 'uploads.mangadex.org',
      },
      {
        protocol: 'https',
        hostname: 'api.mangadex.org',
      },
    ],
  },
};

export default nextConfig;

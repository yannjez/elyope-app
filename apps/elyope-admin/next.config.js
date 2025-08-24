//@ts-check

const { composePlugins, withNx } = require('@nx/next');
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin');

/** @type {import('@nx/next/plugins/with-nx').WithNxOptions} */
const nextConfig = {
  nx: {},
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'img.clerk.com' }],
  },
  webpack: (config, { isServer }) => {
    // Add Prisma plugin for monorepo support
    config.plugins = [...config.plugins, new PrismaPlugin()];

    // ✅ SVGR only for direct TS/JS imports, not CSS/backgrounds, not node_modules
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      exclude: /node_modules/,
      type: 'javascript/auto',
      use: [
        {
          loader: '@svgr/webpack',
          options: { svgo: true, titleProp: true, ref: true },
        },
      ],
    });

    // (Optional) These fallbacks are usually unnecessary on Next 15; keep only if you truly need them.
    config.resolve = config.resolve || {};
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', '@elyope/db'],
  },
};

module.exports = composePlugins(withNx, withNextIntl)(nextConfig);

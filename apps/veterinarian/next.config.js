//@ts-check

const path = require('path');
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

    config.resolve = config.resolve || {};
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },

  serverExternalPackages: ['@prisma/client', '@elyope/db'],
  outputFileTracingIncludes: {
    '.': [
      './node_modules/.prisma/client/**/*',
      './node_modules/@prisma/client/**/*',
    ],
  },
};

module.exports = composePlugins(withNx, withNextIntl)(nextConfig);

//@ts-check

const { composePlugins, withNx } = require('@nx/next');
const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin();
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {},
  webpack: (config, { isServer, nextRuntime }) => {
    if (isServer) {
      config.plugins.push(new PrismaPlugin());
    }
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    // Exclude Prisma Client from client-side bundle
    if (nextRuntime === 'edge' || !isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    return config;
  },
  outputFileTracingIncludes: {
    '.': ['node_modules/.prisma/client/**/*'],
  },

  serverExternalPackages: ['@elyope/db'],
};

module.exports = composePlugins(withNx, withNextIntl)(nextConfig);

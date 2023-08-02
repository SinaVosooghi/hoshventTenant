/** @type {import('next').NextConfig} */
// next.config.js
const withAntdLess = require("next-plugin-antd-less");
const withLess = require("next-with-less");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(
  withLess({
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    ...withAntdLess({
      webpack(config) {
        config.module.rules.push({
          test: /\.svg$/,
          issuer: {
            test: /\.(js|ts)x?$/,
          },

          use: ["@svgr/webpack"],
        });

        return config;
      },
      // optional
      lessVarsFilePath: "./src/styles/variables.less",
      lessVarsFilePathAppendToEndOfContent: true,
      cssLoaderOptions: {
        modules: {
          localIdentName:
            process.env.NODE_ENV !== "production"
              ? "[folder]__[local]__[hash:4]"
              : "[hash:8]",
        },
      },
      reactStrictMode: true,
      swcMinify: true,
      images: {
        formats: ["image/avif", "image/webp"],
        domains: [
          "localhost",
          "127.0.0.1",
          "https://hoshvent.com",
          "hoshvent.com",
        ],
      },
      trailingSlash: true,
      webpack(config, nextConfig) {
        return config;
      },
    }),
  })
);

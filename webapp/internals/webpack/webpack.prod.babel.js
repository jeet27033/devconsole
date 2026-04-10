// Important modules this config uses
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// Comment out ESBuildMinifyPlugin and use ESBuildPlugin if you face any issues with minified production build while embedding in other apps
const { ESBuildMinifyPlugin } = require('esbuild-loader');
// const { ESBuildPlugin } = require('esbuild-loader');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; //eslint-disable-line
// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

const appConfig = require('../../app-config');

const useSourceMaps = appConfig.useSourceMaps;
const sanitizeAppName =  require('./utils/sanitizeAppName');
const sanitizedMFEChunkName = `${sanitizeAppName(appConfig.appName)}_MFE`;

const bundleAnalyzerEnabled = process.env.ANALYZE === 'true';

const bundleAnalyzer = [];

// enable when build steps analysis is required to see which steps n plugins take more time: use smp.wrap on the whole config object
// const smp = new SpeedMeasurePlugin({
//   disable: !bundleAnalyzerEnabled,
//   // disable: false,
//   outputFormat: 'human', // detailed logs
//   granularLoaderData: false,
// });

if (bundleAnalyzerEnabled) {
  bundleAnalyzer.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      defaultSizes: 'parsed',
      openAnalyzer: false,
      generateStatsFile: true,
      statsOptions: {
        source: false,
      },
      logLevel: 'info',
    }),
  );
}

module.exports = 
  require('./webpack.base.babel')({
    mode: 'production',
    // In production, we skip all hot-reloading stuff
    entry: {
      main: [path.join(process.cwd(), 'app/app.js')],
      [sanitizedMFEChunkName]: [path.join(process.cwd(), 'app/entry.js')],
    },
    devtool: useSourceMaps ? 'source-map' : false,

    // Utilize long-term caching by adding content hashes (not compilation hashes) to compiled assets
    output: {
      filename: '[name].[chunkhash].js',
      chunkFilename: '[name].[chunkhash].chunk.js',
    },
    stats: {
      warnings: false,
      children: false,
      optimizationBailout: true, //REACT-18 Upgrade: replacement if --display-optimization-bailout in webpack 5
      modules: false, // REACT-18 Upgrade: replacement of --hide-modules in webpack 5
    },
    optimization: {
      moduleIds: 'named', // REACT-18 Upgrade: replacement of namedModules in webpack 5
      minimize: true,
      minimizer: [
        // Comment out ESBuildMinifyPlugin and use ESBuildPlugin if you face any issues with minified production build while embedding in other apps
        new ESBuildMinifyPlugin({
          target: 'es2015', // Syntax to compile to
          css: true, // Apply minification to CSS assets
        }),
        // new ESBuildPlugin({
        //   target: 'es2015', // Syntax to compile to
        // }),
      ],
      nodeEnv: 'production',
      sideEffects: true,
      concatenateModules: true,
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
              )[1];
              if (packageName.includes('capillarytech')) {
                const packageNameMatch = module.context.match(
                  /[\\/]node_modules[\\/]@capillarytech[\\/](.*?)([\\/]|$)/
                );
                // Check if there's a match specific to '@capillarytech' scoped packages
                if ( packageNameMatch[1]) {
                  const packageNamed = packageNameMatch[1];
                  return `lib.capillarytech.${packageNamed}`;
                } else {
                  return `lib.capillarytech`;
                }
              }
              return `vendor.${packageName.replace('@', '')}`;
            },
          },
          main: {
            chunks: 'all',
            minChunks: 5, // USE CASE: fixing remoteEntry.js issue
            reuseExistingChunk: true,
            enforce: true,
          },
          common: {
            name: `chunk-common`,
            minChunks: 3, // USE CASE: fixing remoteEntry.js issue
            enforce: true,
            priority: -20,
            chunks: 'async',
            reuseExistingChunk: true,
            test(module) {
              if (
                module.type === 'provide-module' ||
                module.type === 'consume-shared-module' ||
                module.type === 'remote-module'
              ) {
                return false;
              }
              return true;
            },
          },
        },
      },
      // runtimeChunk: true,
    },
    plugins: [
      new webpack.optimize.AggressiveMergingPlugin(),
      ...bundleAnalyzer,

      // Minify and optimize the index.html
      new HtmlWebpackPlugin({
        template: 'app/index.html',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
        inject: true,
        favicon: 'app/favicon.ico',
      }),
    ],

    performance: {
      assetFilter: assetFilename =>
        !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename), //eslint-disable-line
    },
  });


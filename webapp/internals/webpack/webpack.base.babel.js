/**
 * COMMON WEBPACK CONFIGURATION
 */

const prebuildValidations = require('./validations/prebuild-validations');
prebuildValidations();

const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BugsnagPlugin = require('webpack-bugsnag-plugins');

const pathConfig = require('../../app/config/path');
const antThemeVars = require('../../ant-theme-vars');
const { ModuleFederationPlugin } = require('webpack').container;

const miniCssExtractPlugin = [];
const { dependencies } = require('../../package.json');
const appConfig = require('../../app-config');

const mfeExposedComponents = require('../../mfe-exposed-components');

const sanitizeAppName =  require('./utils/sanitizeAppName');
const sanitizedMFEChunkName = `${sanitizeAppName(appConfig.appName)}_MFE`;

const CURRENT_APP_NAME = appConfig.appName;
const CURRENT_APP_NAME_HASH = require('../../internals/generators/utils/appNameHash')();

let bugsnagAppVersion;
let bugsnagApiKey;
let bugsnagConfig = {};
const bugsnagPlugin = [];

const isProdEnv = process.env.NODE_ENV === 'production';

if(appConfig.bugsnag.useBugsnag){
  const currentDate = new Date().toLocaleString().replace(/[^\w\s]/g, '_').replace(/\s/g, '_');
  bugsnagApiKey = appConfig.bugsnag.apiKey;
  bugsnagAppVersion = `${appConfig.appName}__${currentDate}`;
  bugsnagConfig = {
    BUGSNAG_APP_VERSION: JSON.stringify(bugsnagAppVersion),
    BUGSNAG_API_KEY: JSON.stringify(bugsnagApiKey),
  }
  if(isProdEnv){
    bugsnagPlugin.push(new BugsnagPlugin.BugsnagSourceMapUploaderPlugin({
      apiKey: bugsnagApiKey,
      appVersion: bugsnagAppVersion,
    }))
  }
}

if(isProdEnv){
  miniCssExtractPlugin.push(new MiniCssExtractPlugin({
    filename: '[name].[contenthash].css',
  }));
}

const postcssOptions = {
  plugins: {
    'postcss-prefix-selector': {
      prefix: `.${appConfig.appName}`,
      transform(prefix, selector, prefixedSelector, filepath) {
        if (selector.match(/^(html|body)/)) {
          return selector.replace(/^([^\s]*)/, `$1 ${prefix}`);
        }

        if (filepath.match(/node_modules/)) {
          return selector; // Do not prefix styles imported from node_modules
        }

        return prefixedSelector;
      },
    },
  },
};

const getSharedDependencies = dependencies => {
  return {
    'react-dom': {
      singleton: true,
      eager: true,
    },
    react: {
      singleton: true,
      eager: true,
    },
    'react-router-dom': {
      singleton: true,
      eager: true,
    },
    'react-router': {
      singleton: true,
      eager: true,
    },
    'react-router-redux': {
      singleton: true,
      eager: true,
    },
  };
};

module.exports = options => ({
  mode: options.mode,
  entry: options.entry,
  stats: options.stats,
  output: Object.assign(
    {
      // Compile into js/dist.js
      path: path.resolve(process.cwd(), 'dist'),
      publicPath: pathConfig.prefixPath,
    },
    options.output,
  ), // Merge with env dependent settings
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'jsx', // Remove this if you're not using JSX
          target: 'es2015', // Syntax to compile to (see options below for possible values)
        },
        exclude: /node_modules\/(?!@capillarytech)|cap-react-ui-library|cap-style-guide|cap-ui-library/,
      },
      {
        test: /\.js$/, // Transform all .js files required somewhere with Babel
        use: [
          {
            loader: 'thread-loader',
          },
          {
            loader: 'babel-loader',
            options: options.babelQuery,
          },
        ],
        include: /cap-react-ui-library|cap-style-guide|cap-ui-library/,
        exclude: /cap-react-ui-library\/node_modules|cap-style-guide\/node_modules|cap-ui-library\/node_modules/,
      },
      {
        test: /\.scss$/,
        exclude: filepath => {
          return (
            (/node_modules/.test(filepath) &&
              !/@capillarytech/.test(filepath)) ||
            /\/app\//.test(filepath)
          );
        },
        use: [
          isProdEnv ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'sass-loader',
          'sass-loader?sourceMap',
        ],
      },
      {
        test: /\.scss$/,
        exclude: /node_modules\//,
        use: [
          isProdEnv ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          {
            loader: require.resolve('postcss-loader'),
            options: {
              postcssOptions: postcssOptions,
            },
          },
          'sass-loader',
          'sass-loader?sourceMap',
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
          loader: isProdEnv ? MiniCssExtractPlugin.loader : 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
            options: {
              modifyVars: antThemeVars,
              javascriptEnabled: true,
            },
          },
        ],
      },
      {
        // // Do not transform vendor's CSS with CSS-modules
        // // The point is that they remain in global scope.
        // // Since we require these CSS files in our JS or CSS files,
        // // they will be a part of our compilation either way.
        // // So, no need for ExtractTextPlugin here.
        test: /\.css$/,
        use: [
          isProdEnv ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          {
            loader: require.resolve('postcss-loader'),
            options: {
              postcssOptions: postcssOptions,
            },
          },
        ],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|jpg|png|gif|avif)$/,
        type: 'asset/resource',
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.(mp4|webm)$/,
        type: 'asset/inline',
      },
      {
        test: /\.csv$/,
        use: 'file-loader?name=[name].[ext]',
      },
    ],
  },
  plugins: options.plugins.concat([
    new CopyPlugin(
      [
        { 
          from: path.resolve(__dirname, '../../app-config.js'),
        },
        { 
          from: path.resolve(__dirname, '../../mfe-exposed-components.js'),
        },
      ]
    ),
    ...miniCssExtractPlugin,

    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
      CURRENT_APP_NAME: JSON.stringify(CURRENT_APP_NAME),
      CURRENT_APP_NAME_HASH: JSON.stringify(CURRENT_APP_NAME_HASH),
      ...bugsnagConfig,
    }),
    ...bugsnagPlugin,
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),

    new ModuleFederationPlugin({
      name: sanitizedMFEChunkName, //this name should match the entry object's field {}. DO NOT CHANGE this Name!!!
      filename: 'remoteEntry.js', // output a js file
      exposes: mfeExposedComponents,
      shared: {
        // and shared
        ...getSharedDependencies(dependencies),
      },
    }),
  ]),
  resolve: {
    modules: ['app', 'node_modules'],
    alias: {
      moment$: 'moment/moment.js',
      react: path.resolve('node_modules/react'),
      'react-dom': path.resolve('node_modules/react-dom'),
      antd: path.resolve('node_modules/antd'),
      'react-helmet': path.resolve('node_modules/react-helmet'),
      'react-intl': path.resolve('node_modules/react-intl'),
      'react-redux': path.resolve('node_modules/react-redux'),
      'redux-saga': path.resolve('node_modules/redux-saga'),
      'styled-components': path.resolve('node_modules/styled-components'),
      'react-router': path.resolve('node_modules/react-router'),
      '@capillarytech/cap-ui-library': path.resolve(
        'node_modules/@capillarytech/cap-ui-library/',
      ),
      '@capillarytech/cap-ui-utils': path.resolve(
        'node_modules/@capillarytech/cap-ui-utils/',
      ),
      'immutable': path.resolve('node_modules/immutable'),
      'connected-react-router/immutable': path.resolve('node_modules/connected-react-router/immutable'),
      'redux-immutable': path.resolve('node_modules/redux-immutable'),
      'history': path.resolve('node_modules/history'),
      'hoist-non-react-statics': path.resolve('node_modules/hoist-non-react-statics'),
      '@bugsnag/js': path.resolve('node_modules/@bugsnag/js'),
      '@bugsnag/plugin-react': path.resolve('node_modules/@bugsnag/plugin-react'),
      'lodash': path.resolve('node_modules/lodash'),
    },
    fallback: {
      fs: false,
      path: require.resolve('path-browserify'),
      os: require.resolve('os-browserify/browser'),
    },
    extensions: ['.js', '.jsx', '.react.js'],
    mainFields: ['browser', 'jsnext:main', 'main'],
  },
  devtool: options.devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window
  performance: options.performance || {},
  optimization: options.optimization,
});

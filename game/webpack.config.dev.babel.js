require('@babel/register');

import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import WebpackBar from 'webpackbar';

module.exports = require('./public/webpack/development.js').buildDevelopmentWebpackConfiguration([
  new BundleAnalyzerPlugin({
    analyzerPort: 8848,
    openAnalyzer: false,
  }),
  new FriendlyErrorsWebpackPlugin({
    compilationSuccessInfo: {
      messages: ['Your application is running here: http://localhost:7988'],
    },
    clearConsole: false,
  }),
  new WebpackBar({
    profile: false,
    // color: '',
  })
]);

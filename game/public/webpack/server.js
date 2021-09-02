import webpack from 'webpack';
import WebpackNodeExternals from 'webpack-node-externals';
import merge from 'webpack-merge';
import { buildWebpackBaseConfig } from './common';
import { buildLodaers } from './loader';


export const buildServerWebpackConfiguration = (morePlugins = [
  new webpack.ProvidePlugin({
    window: ['ssr-window', 'window'],
    document: ['ssr-window', 'document'],
  })
]) => {
  return merge(
    buildWebpackBaseConfig([{
      name: 'index',
      path: './public/server/index.js',
    }], morePlugins, {}, false, true),
    buildLodaers(false, true),
    {
      mode: "production",
      target: 'node',
      devtool: 'eval-source-map',
      externals: [WebpackNodeExternals()],  //排除不需要的打包模块
      node: {
        __filename: true,
        __dirname: true
      },
    }
  )
};

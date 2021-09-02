import merge from 'webpack-merge';

import AssetsPlugin from 'assets-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import HtmlWebpackPlugin from "html-webpack-plugin";
import { buildWebpackBaseConfig } from './common';
import { buildLodaers } from './loader';
import { ROOT } from '../paths';
import { WebsiteBaseInfo } from './constant';


export const buildProductionWebpackConfiguration = (morePlugins = [], minifyHtml = true) => {
  const plugins = [
    new AssetsPlugin({
      path: ROOT.DIST.BUILD,
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      favicon: '',
      hash: false,
      inject: false,                    // 不自动注入文件，需要在模板里设定对应输出
      template: ROOT.DIST.INDEX_HTML,
      minify: minifyHtml ? {                         // 压缩HTML文件
        removeComments: false,          // 移除HTML中的注释
        collapseWhitespace: true,       // 删除空白符与换行符
        minifyCSS: true,                // 压缩css
        minifyJS: true,                 // 压缩js
      } : {
        removeComments: false,
        collapseWhitespace: false,
        minifyCSS: false,
        minifyJS: false,
      },
      website: WebsiteBaseInfo,
    }),
    new OptimizeCSSAssetsPlugin(),
    ...morePlugins,
  ];
  return merge(
    buildWebpackBaseConfig([{
      name: 'index',
      path: './src/index.js',
      plugin: [
        'react-hot-loader/patch',
        '@babel/polyfill',
      ],
    }], plugins, {}, false, false),
    buildLodaers(false, false),
    {
      mode: "production",
      // 用eval-source-map时，启动时慢一些，热更新时很快，浏览器里可以看到原本的代码。（发布到生产时不可以用这个！）
      devtool: 'source-map',
      stats: "normal",
      optimization: {
        minimize: true,
      },
    }
  )
};

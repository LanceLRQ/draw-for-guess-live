import webpack from 'webpack';
import merge from 'webpack-merge';
import { buildWebpackBaseConfig } from './common';
import { buildLodaers } from './loader';
import HtmlWebpackPlugin from "html-webpack-plugin";
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';
import { ROOT } from '../paths';
import { buildWebpackDevServer } from './dev_server';
import { WebsiteBaseInfo } from './constant';


export const buildDevelopmentWebpackConfiguration = (morePlugins = []) => {
  const plugins = [
    // new webpack.NamedModulesPlugin(),  // config.optimization.namedModules
    new webpack.HotModuleReplacementPlugin(),
    new HardSourceWebpackPlugin.ExcludeModulePlugin([{
      // HardSource works with mini-css-extract-plugin but due to how
      // mini-css emits assets, assets are not emitted on repeated builds with
      // mini-css and hard-source together. Ignoring the mini-css loader
      // modules, but not the other css loader modules, excludes the modules
      // that mini-css needs rebuilt to output assets every time.
      test: /mini-css-extract-plugin[\\/]dist[\\/]loader/,
    }]),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      favicon: '',
      hash: true,
      inject: false,                    // 不自动注入文件，需要在模板里设定对应输出
      template: ROOT.DIST.INDEX_HTML,
      website: WebsiteBaseInfo,
      minify: {                         // 压缩HTML文件
        removeComments: true,          // 移除HTML中的注释
      }
    }),
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
    }], plugins, {}, true, false),
    buildLodaers(true, false),
    buildWebpackDevServer('0.0.0.0', 7988),
    {
      // 用eval-source-map时，启动时慢一些，热更新时很快，浏览器里可以看到原本的代码。（发布到生产时不可以用这个！）
      devtool: 'eval-source-map',
      // 根据React的要求，开发环境要将react-dom重定向到@hot-loader/react-dom
      resolve: {
        alias: {
          'react-dom': '@hot-loader/react-dom'
        },
      },
    }
  )
};

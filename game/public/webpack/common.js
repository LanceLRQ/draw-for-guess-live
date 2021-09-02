import { buildEntries } from './utils';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';
import { ROOT } from '../paths';
import webpack from 'webpack';

/**
 * 构建Webpack的基本配置
 * @param dev     构建模式
 * @param plugins Webpack自定义插件列表
 * @param groups  自定义SplitChunks插件的 cacheGroups
 * @param ssr     SSR模式
 * @param entries: [{name: '', plugins: ['@babel/polyfill'] }]
 *        name必填，参数plugins可以省略
 */
export const buildWebpackBaseConfig = (entries, plugins, groups = {}, dev = true, ssr = false) => {
  // 处理入口定义
  const entry = {};
  // 默认定义这个入口
  entries.forEach((item) => {
    if (!item.name) throw new Error('entry config error');
    entry[item.name] = buildEntries(item.path, item.plugins);
  });
  let pluginsList = [
    new webpack.DefinePlugin({
      'process.env': {
        BUILD_ENV: JSON.stringify({
          version: process.env['BRANCH_NAME'],
          commit: process.env['GIT_COMMIT'],
          build: process.env['BUILD'],
        }),
        NODE_ENV: JSON.stringify(dev ? 'development' :'production'),
        SSR_MODE: JSON.stringify(ssr ? 'on' :'off'),
        API_HOST: JSON.stringify( '//localhost:7988/api'),
      }
    }),
  ];
  if (!ssr) {
    pluginsList = pluginsList.concat([
      // 将CSS提取成独立文件。不使用这个插件时，CSS将被打包到代码里，在运行时释放。
      new MiniCssExtractPlugin({
        filename: dev ? '[name].css' : '[name].[hash].css',
        chunkFilename: dev ? '[name].css' : '[name].[hash].css',
        ignoreOrder: dev
      }),
      // 静态文件复制插件 (似乎有问题，有需要再解决）
      new CopyWebpackPlugin({
        patterns: [
          {from: ROOT.SRC.STATIC, to: 'static'},
        ]
      }),
      // 打包优化插件
      new HardSourceWebpackPlugin(),
    ]);
  }
  pluginsList = pluginsList.concat(plugins);
  return {
    // 构建模式，支持开发模式和生产模式
    mode: dev ? 'development' : 'production',
    // 入口
    entry,
    // 反射目录
    resolve: {
      // 目录别名
      alias: {
        '@': ROOT.SRC.SELF,
      },
      // 配置可以省略的后缀：如 import './index.js' 可以写成 './index'
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss', '.less'],
    },
    // 输出文件
    output: ssr ? {
      path: ROOT.DIST.SERVER,
      filename: 'index.js',
    } : {
      path: ROOT.DIST.BUILD,
      filename: '[name].[hash].bundle.js',
      chunkFilename: '[name].[hash].chunk.js'
    },
    // 并行数
    parallelism: 5,
    // 统计信息
    stats: 'verbose',
    // 构建优化设置
    optimization: ssr ? {
      minimize: false
    } : {
      namedModules: dev,
      // 默认禁用压缩，如果生产环境需要，可以再次打开
      minimize: false,
      // Webpack的运行时文件名称
      runtimeChunk: {
        name: "manifest"
      },
      // 替代原来的SplitChunksPlugin
      splitChunks: {
        // all: 把所有模块都扔到vendors里边；
        // initial： 把非动态模块扔到vendors里，动态模块打包
        // async： 把动态模块扔到vendors里，非动态模块保持原样
        chunks: 'all',
        // 每个包大小的最小值
        minSize: 20000,
        // 最小chunk数量，当模块被引用超过这个数量时，会被拆分到公共模块
        minChunks: 1,
        // 按需加载的最大并发数，可以减少重复加载公共chunk的次数，但数字不是越大越好，请按你的项目依赖引用情况设定
        maxAsyncRequests: 10,
        maxInitialRequests: 10,
        // 分隔符，默认是~，如lodash打包后变成 vendor~lodash.js等。~符号这里改成.符号
        automaticNameDelimiter: '.',
        // 自动构建名字，改写成函数后可以自定义生成文件名的规则
        name: true,
        // 缓存组，这个最关键，决定了splitChunks如何拆分代码
        cacheGroups: {
          // 默认组
          default: {
            // 优先级：数字越大，优先级越高。
            priority: -20,
            minChunks: 2, // 模块被引用>=2次，拆分至vendors公共模块
            // 表示是否使用已有的chunk，true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，
            // 那么将不会重新生成新的，即几个 chunk 复用被拆分出去的一个 module
            reuseExistingChunk: true
          },
          // 自定义依赖
          ...groups,
          // 其他依赖
          vendors: {
            name: 'vendors',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
          },
          // 把项目里的css都搞到一个文件里
          styles: {
            name: 'styles',
            chunks: 'all',
            test: /\.css$/,
            // 忽略掉minChunks、maxAsyncRequests、maxInitialRequests等
            enforce: true,
          },
        }
      }
    },
    // 插件：这里将默认启用一些重要插件，其他附加插件可以调用函数时传入
    plugins: pluginsList,
  };
};

import fs from 'fs';
import path from 'path';
import AutoPrefixer from 'autoprefixer';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { WebpackLoaderBuilder } from './utils';

/**
 * Loader构建器
 * @param dev
 * @param ssr
 */
export const buildLodaers = (dev = true, ssr = false) => {
  const builder = new WebpackLoaderBuilder();
  // 解析.babelrc文件
  const babelRcFile = fs.readFileSync(path.resolve('.babelrc'));
  const babelRc = JSON.parse(babelRcFile.toString());


  const babelPlugins = [
    // AntDesign的东西：
    // ["import", { "libraryName": "antd", "style": true }],
    // Lodash的按需加载：
    ['lodash', { 'id': ['lodash'] }],
    // Babel插件
    ...babelRc.plugins,
  ];
  if (dev) babelPlugins.push(['react-hot-loader/babel']);

  // 注册Babel的Loader
  const BABEL_LOADER = builder.registerHappyPackLoader('babel@7', [{
    loader: 'babel-loader',
    options: {
      plugins: babelPlugins,
      presets: [
        ['@babel/env', {
          "modules": false,
          "targets": {
            "browsers": [
              "chrome >= 43",
              "safari >= 7",
              "ie >= 11",
              "firefox >= 48"
            ]
          }
        }],
        ['@babel/react']
      ],
    },
  }], 2);

  const LESS_LOADER = builder.registerHappyPackLoader('less-loader', [{
    loader: 'less-loader',
    options: {
      // modifyVars: antdTheme,
      javascriptEnabled: true,
    },
  }], 2);


  // Babel Loader
  builder.registerLoader({
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: [builder.getHappyPackLoaderName(BABEL_LOADER)]
  });

  // TypeScript Loader
  builder.registerLoader({
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: ['ts-loader']
  });


  // Static File Loader
  builder.registerLoader({
    test: /\.(jpe?g|png|gif|tiff|webp|ttf|woff|woff2|eot)$/,
    use: [{
      loader: 'file-loader',
      options: {
        name: dev ? '[hash].[ext]?debug=[path][name]' : '[hash].[ext]',
        outputPath: 'static',
        publicPath: function(path){
          return '/static/' + path;   // 输出到网站的 /static 目录下
        }
      },
    }]
  });

  // Less Loader
  builder.registerLoader({
    test: /\.less$/,
    // include: [antd],
    use: [
      // { loader: 'cache-loader' },
      'style-loader',
      'css-loader',
      builder.getHappyPackLoaderName(LESS_LOADER),
    ],
  });

  // Svg Loader
  builder.registerLoader(
    {
      test: /\.svg$/,
      loader: 'svg-sprite-loader',
      options: {
        symbolId: 'svg-[name]'
      }
    },
  );

  // Sass Loader 10.x (用官方推荐的dart-sass，node-sass要编译，日常下载失败，很麻烦)
  // 注意，不要在新版的sass-loader里用HappyPack，出错到你怀疑人生
  // 加了MiniCssExtractPlugin以后也不要用thread-loader
  const babelLoaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: dev, // 仅dev环境启用HMR功能
        reloadAll: true,
      },
    },
    'css-loader',
    {
      loader: 'postcss-loader',
      options: {
        plugins() {
          return [
            AutoPrefixer({
              cascade: false,
            })
          ];
        },
      },
    },
    {
      loader: 'sass-loader',
      options: {
        implementation: require('sass'),
        sassOptions: {
          fiber: require('fibers'),
        },
        // sourceMap: true,
        additionalData: "@import '@/styles/antd/index.scss';",
      },
    }
  ];
  if (ssr) babelLoaders.shift();
  builder.registerLoader({
    test: /\.(scss|sass|css)$/,
    use: babelLoaders,
  });

  return builder.webpackConfigs;
};

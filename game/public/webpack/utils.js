import fs from 'fs';
import os from 'os';
import path from 'path';
import HappyPack from 'happypack';

/**
 * 构建Webpack的入口参数列表
 *
 * 例如
 *
 * @param entry    入口文件
 * @param plugins  导入插件
 * @returns {[]}
 */
export const buildEntries = (entry, plugins) => {
  let bundle = [];
  if (plugins && plugins instanceof Array) {
    bundle = bundle.concat(plugins);
  } else {
    // bundle.push('react-hot-loader/patch');   // React的热替换插件
    bundle.push('@babel/polyfill');          // Babel的polyfill插件
  }
  bundle.push(entry);
  return bundle
};

/**
 * 构建Loader，
 */
export function WebpackLoaderBuilder () {
  const configs = {
    module: {
      rules: [],
    },
    plugins: []
  };
  const happyPackLoaderIdMapping = {};
  const happyPackLoaderSymbolMapping = {};
  const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
  Object.defineProperties(this, {
    webpackConfigs: {
      get: function () { return configs; }
    }
  });
  /**
   * 注册HappyPack的Loader
   * @param id          ID
   * @param loaders     Loader列表
   * @param threads     线程数
   * @return symbol     返回对应的符号变量，外部直接用即可，无须关心ID是什么
   */
  this.registerHappyPackLoader = (id, loaders, threads = 2) => {
    if (happyPackLoaderIdMapping[id]) throw new Error('a HappyPack loaders ID duplicated');
    const symbol = Symbol(id);
    happyPackLoaderIdMapping[id] = true;
    happyPackLoaderSymbolMapping[symbol] = id;
    configs.plugins.push(new HappyPack({ id, loaders, threads, threadPool: happyThreadPool }));
    return symbol;
  };
  /**
   * 注册Loader
   * @param rule       loader的规则
   * @param useThread  是否使用webpack自带多线程loader；
   */
  this.registerLoader = (rule, useThread = false) => {
    if (useThread) {
      rule.use.unshift('thread-loader');
    }
    configs.module.rules.push(rule);
  };
  this.getHappyPackLoaderName = (symbol) => `happypack/loader?id=${happyPackLoaderSymbolMapping[symbol]}`;
}


export const deleteFolderTree = (path) => {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(function (file, index) {
      let curPath = path + '/' + file;
      if (fs.statSync(curPath).isDirectory()) {
        deleteFolderTree(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

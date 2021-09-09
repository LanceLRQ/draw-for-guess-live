/**
 * Webpack Dev Server 配置构建
 * @param host
 * @param port
 */
export const buildWebpackDevServer = (host='0.0.0.0', port=3000) => {
  return {
    devServer: {
      // 如果有需要可以设置https证书
      // https: {
      //   key: fs.readFileSync(path.resolve(paths.certs, 'server.key')),
      //   cert: fs.readFileSync(path.resolve(paths.certs, 'server.crt')),
      //   ca: fs.readFileSync(path.resolve(paths.certs, 'ca.pem')),
      // },
      clientLogLevel: 'none',
      port,
      host,
      // 热重载
      hot: true,
      // 内联模式
      inline: true,
      // 将详细进度输出到控制台
      progress: true,
      // 启用GZIP
      compress: true,
      // 配置输出统计信息
      stats: {
        // copied from `'minimal'`
        all: false,
        modules: true,
        maxModules: 0,
        errors: true,
        warnings: true,
        // our additional options
        chunks: true,
        chunkModules: true,
        moduleTrace: true,
        errorDetails: true,
        // 添加资源信息
        // assets: true,
      },
      // 当发生错误时，在浏览器窗口产生一个cover层并描述错误
      overlay: true,
      historyApiFallback: {
        // URL重写，类似nginx的rewrite功能
        rewrites: [
          // { from: /^\//, to: '/index.html' },
        ]
      },
      // 禁用域名检查
      disableHostCheck: true,
      // 转发代理（可以配置对应规则，转发到对应地址去，否则将由devServer处理）
      proxy: {
        '/api': {
          target: 'http://localhost:8975',
          changeOrigin: true,
          secure: false,
          logLevel: 'debug',
          ws: true,
          // 错误的时候在控制台输出内容
          onError(err) {
            console.log('Suppressing WDS proxy upgrade error:', err);
          },
          pathRewrite: {'^/api': `http://localhost:8975/api`}
        },
        // '/api/ws': {
        //   target: 'wss://api.abc.com',
        //   changeOrigin: true,
        //   ws: true,
        //   // 错误的时候在控制台输出内容
        //   onError(err) {
        //     console.log('Suppressing WDS proxy upgrade error:', err);
        //   },
        //   logLevel: 'debug',
        //   pathRewrite: {'^/api/ws': `${apiBase}/ws`}
        // }
      }
    },
  }
};

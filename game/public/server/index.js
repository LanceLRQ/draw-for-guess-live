import Koa from 'koa';
import path from 'path';
import KoaStatic from 'koa-static';
import nodeWatch from 'node-watch';
import { renderToString } from 'react-dom/server';
import { matchRoutes } from "react-router-config";
import { routes } from '../../src/scripts/routes';
import { Template } from './util';
import { ROOT } from '../paths';
import { Startup } from '../../src/scripts/index.jsx';
import { store } from '../../src/scripts/store/index';

const app = new Koa();
const indexFilePath = path.join(process.cwd(), 'dist/build/index.html');

const preloadApiData = (pathname, store) => {
  // 使用 matchRoutes api做路由匹配
  const branch = matchRoutes(routes, pathname);

  const promises = branch.map(({ route, match }) => {
    // 判断匹配的路由是否挂载有异步加载数据逻辑
    // console.log(route, route.fetchData);
    return route.fetchData
      ? route.fetchData(store, match) // 把store 和 match 传入数据预取函数
      : Promise.resolve(null)
  });

  return Promise.all(promises)
};

let htmlBody = new Template(indexFilePath);
nodeWatch(indexFilePath, {
  persistent: false,  // 文件被监听时进程是否继续，默认true
  recursive: false,   // 是否监控所有子目录，默认false 即当前目录，true为所有子目录。
  encoding: 'utf-8',  // 指定传递给回调事件的文件名称，默认utf8
}, () => {
  // 重新载入
  console.log("Index file changed! reloading...");
  htmlBody = new Template(indexFilePath);
});

app.use(async (ctx, next) => {
  const { url } = ctx;

  if (
    url.endsWith('.js') ||
    url.endsWith('.css') ||
    url.endsWith('.ico') ||
    ctx.path.startsWith('/static')
  ) {  // 处理静态文件
    await next();
    return;
  }

  if (url.endsWith('.map')) { return } // map文件要404

  await preloadApiData(ctx.path, store);
  // 创建根节点
  const rootApp = Startup(true, ctx.path);
  // 生成 HTML 逻辑
  const rootBody = renderToString(rootApp);
  const storeBody = `<script>window.__INITIAL_STATE__ = ${JSON.stringify(store.getState())}</script>`;

  // 渲染index.html
  ctx.body = htmlBody.render({
    root: rootBody,
    store: storeBody,
  });
}).use(KoaStatic(ROOT.DIST.BUILD)).listen(5000);

console.log("Server is running...");

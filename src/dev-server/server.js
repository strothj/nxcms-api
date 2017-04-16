import path from 'path';
import Koa from 'koa';
import Router from 'koa-router';
import Pug from 'koa-pug';
import createServer from '../server';

const DEFAULT_DEV_DB = 'mongodb://localhost/nxcms-api-dev';
const dbConnectionString = process.env.NXCMS_DEV_DB || DEFAULT_DEV_DB;

const pug = new Pug({
  // path relative to .build directory
  viewPath: path.resolve(__dirname, '../src/dev-server/views'),
  noCache: true,
  pretty: true,
});

const startServer = async () => {
  const app = new Koa();
  pug.use(app);

  const appConfig = { dbConnectionString };
  const server = await createServer(appConfig);
  const router = new Router();

  router.use(server.routes(), server.allowedMethods());

  router.get('/signup', (ctx) => {
    ctx.render('signup', { csrf: ctx.csrf });
  });

  // router.post('/signup', (ctx) => {
  //   ctx.body = ctx.request.body;
  // });

  router.get('*', (ctx) => {
    ctx.render('index');
  });

  return app.use(router.routes());
};

export default startServer;

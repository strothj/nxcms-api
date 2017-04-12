import path from 'path';
import Koa from 'koa';
import Pug from 'koa-pug';
import { createRouter } from '../server';

const DEFAULT_DEV_DB = 'mongodb://localhost/nxcms-api-dev';
const dbConnectionString = process.env.NXCMS_DEV_DB || DEFAULT_DEV_DB;

const pug = new Pug({
  // path relative to .build directory
  viewPath: path.resolve(__dirname, '../src/dev-server/views'),
  noCache: true,
  pretty: true,
});

const createServer = async () => {
  const app = new Koa();
  pug.use(app);

  const appConfig = { dbConnectionString };
  const router = await createRouter(appConfig);

  router.get('/signup', (ctx) => {
    ctx.render('signup', { csrf: ctx.csrf });
  });

  router.post('/signup', (ctx) => {
    ctx.body = ctx.request.body;
  });

  router.get('*', (ctx) => {
    ctx.render('index');
  });

  return app
    .use(router.routes())
    .use(router.allowedMethods());
};

export default createServer;

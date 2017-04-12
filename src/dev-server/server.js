import Koa from 'koa';
import { createRouter } from '../server';

const DEFAULT_DEV_DB = 'mongodb://localhost/nxcms-api-dev';
const dbConnectionString = process.env.NXCMS_DEV_DB || DEFAULT_DEV_DB;

const createServer = async () => {
  const app = new Koa();

  const appConfig = { dbConnectionString };
  const router = await createRouter(appConfig);

  router.get('*', (ctx) => {
    console.log('placeholder enter'); // eslint-disable-line no-console
    ctx.body = 'placeholder';
    console.log('placeholder exit'); // eslint-disable-line no-console
  });

  return app
    .use(router.routes())
    .use(router.allowedMethods());
};

export default createServer;

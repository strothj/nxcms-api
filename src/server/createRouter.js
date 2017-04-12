import Router from 'koa-router';
import { database } from './core';

const createRouter = async (config) => {
  const router = new Router();

  await database.connect(config.dbConnectionString);

  router.post('/signup', async (ctx, next) => {
    await next();
  });

  router.get('*', async (ctx, next) => {
    console.log('* enter'); // eslint-disable-line no-console
    ctx.state.test = '123';
    await next();
    console.log('* exit'); // eslint-disable-line no-console
  });

  return router;
};

export default createRouter;

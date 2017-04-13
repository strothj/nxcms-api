import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { database } from '../core';
import createCSRFMiddleware from './createCSRFMiddleware';
import createSessionMidleware from './createSessionMiddleware';

const createRouter = async (config) => {
  const router = new Router();

  await database.connect(config.dbConnectionString);
  if (config.isDemoMode) {
    console.log('Demo mode: dropping database'); // eslint-disable-line no-console
    await database.drop();
  }

  router.use('/', createSessionMidleware(config.dbConnectionString));
  router.use(['/signup'],
    bodyParser({ enableTypes: ['form'] }),
    createCSRFMiddleware(),
  );

  router.get('/signup', async (ctx, next) => {
    await next();
  });

  router.post('/signup', async (ctx, next) => {
    await next();
  });

  router.get('*', async (ctx, next) => {
    await next();
  });

  return router;
};

export default createRouter;

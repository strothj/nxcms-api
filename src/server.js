import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import jsonError from 'koa-json-error';
import config from './config';
import { database } from './core';
import { ArticleController } from './articles';
import { SessionController } from './session';
import { UserController } from './users';

const jsonErrorFormat = err => ({
  message: err.message,
  name: err.name,
  stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  status: err.status,
  validationErrors: err.validationErrors,
});

const sessionController = new SessionController();
const controllers = [sessionController].concat(
  [ArticleController, UserController].map(C => new C())
);

const createApp = async () => {
  console.log(`Using ${process.env.NODE_ENV} database`); // eslint-disable-line no-console
  await database.connect();
  if (config.isDemoMode) {
    console.log('Demo mode activated, dropping previous database'); // eslint-disable-line no-console
    await database.drop();
  }

  await Promise.all(controllers.map(c => c.bootstrap()));

  const app = new Koa();
  const router = new Router();
  router.use('/api', [
    jsonError(jsonErrorFormat),
    sessionController.middleware,
  ]);

  controllers.forEach(c => {
    router.use(
      `/api/${c.name}`,
      bodyParser({ enableTypes: 'json' }),
      c.router.routes(),
      c.router.allowedMethods()
    );
  });

  app.use(router.routes());

  return app;
};

export default createApp;

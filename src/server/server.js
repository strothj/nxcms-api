import Router from 'koa-router';
import { database } from './core';
import * as middleware from './middleware';
import { userController } from './services/users';

const controllers = [
  userController,
];

const demoModeInit = async (isDemoMode) => {
  if (isDemoMode) {
    console.log('Demo mode: dropping database'); // eslint-disable-line no-console
    await database.drop();
  }
};

const createServer = async (config) => {
  const router = new Router();

  await database.connect(config.dbConnectionString);
  await demoModeInit(config.isDemoMode);

  router.use(middleware.session(config.dbConnectionString));

  router.use(['/signup'],
    middleware.bodyParser('post'),
    middleware.csrf(),
  );

  controllers.forEach((controller) => {
    router.use('/api', middleware.bodyParser('json'));
    // router.use(controller().prefix('/').routes());
    // router.use(controller().prefix('/api/user/').routes());
    router.use(controller.staticRouter.routes());
    router.use(controller.apiRouter.routes());
  });

  return router;
};

export default createServer;

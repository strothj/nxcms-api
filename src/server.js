import Koa from 'koa';
import config from './config';
import { database } from './core';

const createApp = async () => {
  await database.connect();
  if (config.isDemoMode) {
    console.log('Demo mode activated, dropping previous database'); // eslint-disable-line no-console
    await database.drop();
  }

  const app = new Koa();
  app.use((ctx) => {
    ctx.body = 'Placeholder';
  });

  return app;
};

export default createApp;

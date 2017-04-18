import Koa from 'koa';
import { database } from './core';

const createApp = async () => {
  await database.connect();

  const app = new Koa();
  app.use((ctx) => {
    ctx.body = 'Placeholder';
  });

  return app;
};

export default createApp;

import Koa from 'koa';
import { database } from '../server';

const DEFAULT_DEV_DB = 'mongodb://localhost/nxcms-api-dev';
const dbConnectionString = process.env.NXCMS_DEV_DB || DEFAULT_DEV_DB;

const createServer = async () => {
  await database.connect(dbConnectionString);
  const koa = new Koa();

  koa.use((ctx) => {
    ctx.body = 'Placeholder';
  });

  return koa;
};

export default createServer;

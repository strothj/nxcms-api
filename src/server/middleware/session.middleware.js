import session from 'koa-generic-session';
import MongoStore from 'koa-generic-session-mongo';
import convert from 'koa-convert';

const createSessionStore = dbConnectionString => new MongoStore({
  url: dbConnectionString,
});

const createSessionMiddleware = dbConnectionString => (
  convert(
    session({
      key: 'session',
      prefix: '',
      store: createSessionStore(dbConnectionString),
      cookie: {
        maxAge: 24 * 60 * 60 * 1000 * 30, // 30 days in ms
      },
    }),
  )
);

export default createSessionMiddleware;

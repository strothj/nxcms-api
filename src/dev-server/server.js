import Koa from 'koa';

const app = new Koa();

app.use((ctx) => {
  ctx.body = 'Placeholder';
});

export default app;

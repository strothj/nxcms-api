export default async (ctx, next) => {
  if (!ctx.state.user) ctx.throw(401, 'not authorized');
  await next();
};

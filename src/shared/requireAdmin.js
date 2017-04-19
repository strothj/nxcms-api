export default async (ctx, next) => {
  const isAdmin = ctx.state.user && ctx.state.user.isAdmin;
  if (!isAdmin) ctx.throw(401, 'not authorized');
  await next();
};

import validate from 'validate.js';

export default constraints => async (ctx, next) => {
  const validationErrors = validate(ctx.headers, constraints);
  if (validationErrors) {
    ctx.throw(422, 'validation failed', { validationErrors });
  }
  await next();
};

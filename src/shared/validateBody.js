import validate from 'validate.js';

export default constraints => async (ctx, next) => {
  const validationErrors = validate(ctx.request.body, constraints);
  if (validationErrors) {
    ctx.throw(422, 'validation failed', { validationErrors });
  }
  await next();
};

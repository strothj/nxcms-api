import mongoose from 'mongoose';
import { errors } from '../core';

const validationErrorMiddleware = async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    if (e instanceof mongoose.Error.ValidationError || e.code === errors.VALIDATION_ERROR) {
      e.status = 422;
      e.expose = true;
      console.log(e); // eslint-disable-line no-console
    }
    throw e;
  }
};

export default validationErrorMiddleware;

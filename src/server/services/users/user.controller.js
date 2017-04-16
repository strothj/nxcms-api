import Router from 'koa-router';
import bcrypt from 'bcrypt';
import pick from 'lodash.pick';
import User from './user.model';

const saltRounds = process.env.NODE_ENV === 'test' ? 1 : 10;
const router = new Router();

export const encryptPassword = async (ctx, next) => {
  const body = ctx.request.body;
  if (body.password.length < 6) ctx.throw(422, 'password too short');
  if (body.password.length > 50) ctx.throw(422, 'password too long');
  if (!ctx.is('application/json')) {
    if (body.password !== body.verifyPassword) ctx.throw(422, 'password and verify password do not match');
  }

  body.password = await bcrypt.hash(body.password, saltRounds);
  delete body.verifyPassword;
  await next();
};

export const unflattenNameFields = async (ctx, next) => {
  const body = ctx.request.body;
  body.name = body.name || {
    firstName: body.firstName,
    lastName: body.lastName,
  };
  delete body.firstName;
  delete body.lastName;

  await next();
};

export const signup = async (ctx) => {
  if (ctx.request.body.isAdmin) ctx.throw(422, 'isAdmin is not allowed');

  const userDetails = pick(ctx.request.body, ['name', 'email', 'password', 'username', 'displayNameUse']);
  userDetails.isAdmin = false;

  User.create(userDetails);
};

router.post('signup', '/signup', encryptPassword, unflattenNameFields, signup);

export default router;

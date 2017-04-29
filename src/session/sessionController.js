import crypto from 'crypto';
import Router from 'koa-router';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import lodash from 'lodash';
import { validateBody, validateHeaders } from '../shared';
import { User, userValidation } from '../users';

const loginConstraints = {
  username: userValidation.username,
  password: userValidation.password,
};

const jwtConstraint = {
  format: {
    pattern: new RegExp(/^Bearer .{100,}/, 'i'),
    message: 'is malformed',
  },
};

let secret;

export const bootstrap = async () => {
  await new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log(
        'WARNING: Using development mode secret for authorization middleware'
      );
      secret = 'secret';
      resolve();
      return;
    }
    crypto.randomBytes(100, (err, buf) => {
      if (err) {
        reject(err);
        return;
      }
      secret = buf;
      resolve();
    });
  });
};

export const login = async ctx => {
  const foundUser = await User.findOne({
    username: new RegExp(`\\b${ctx.request.body.username}\\b`, 'i'),
  });

  if (
    !foundUser ||
    !await bcrypt.compare(ctx.request.body.password, foundUser.password)
  ) {
    ctx.throw(401, 'username or password is incorrect');
  }

  const token = await new Promise((resolve, reject) => {
    jwt.sign(
      lodash.omit(foundUser.toObject(), 'password'),
      secret,
      {},
      (err, t) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(t);
      }
    );
  });

  ctx.body = {
    message: 'success',
    token,
  };
};

export const middleware = async (ctx, next) => {
  await validateHeaders({ authorization: jwtConstraint })(ctx, async () => {
    if (!ctx.headers.authorization) {
      await next();
      return;
    }
    const token = ctx.headers.authorization.slice(7); // Remove "Bearer " from string

    const user = await new Promise((resolve, reject) => {
      jwt.verify(token, secret, {}, (err, t) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(t);
      });
    });

    ctx.state.user = user;

    await next();
  });
};

export const name = 'session';

export const router = new Router();
router.post('/', validateBody(loginConstraints), login);

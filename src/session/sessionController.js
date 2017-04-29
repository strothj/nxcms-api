import crypto from 'crypto';
import Router from 'koa-router';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import lodash from 'lodash';
import { validateBody } from '../shared';
import { User, userValidation } from '../users';

const loginConstraints = {
  username: userValidation.username,
  password: userValidation.password,
};

let secret;

export const bootstrap = async () => {
  await new Promise((resolve, reject) => {
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

export const name = 'session';

export const router = new Router();
router.post('/', validateBody(loginConstraints), login);

import Router from 'koa-router';
import bcrypt from 'bcrypt';
import lodash from 'lodash';
import config from '../config';
import { requireAdmin } from '../shared';
import User from './User';

const DEFAULT_ADMIN_USERNAME = 'admin';
const DEFAULT_ADMIN_PASSWORD = 'admin';

export const bootstrap = async () => {
  const existingAdmin = await User.findOne({ isAdmin: true });
  if (!existingAdmin) {
    return User.create({
      username: DEFAULT_ADMIN_USERNAME,
      password: await bcrypt.hash(
        DEFAULT_ADMIN_PASSWORD,
        config.bcryptSaltRounds
      ),
      displayNameUse: 'username',
      isAdmin: true,
    });
  }
  return Promise.resolve();
};

export const getAll = async ctx => {
  let users = await User.find({});
  users = users.map(u => lodash.omit(u.toJSON(), 'password'));
  ctx.body = users;
};

export const name = 'users';

export const router = new Router();
router.get('/', requireAdmin, getAll);

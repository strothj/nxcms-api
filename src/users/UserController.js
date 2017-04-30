import bcrypt from 'bcrypt';
import config from '../config';
import { Controller } from '../shared';
import User from './User';

const DEFAULT_ADMIN_USERNAME = 'admin';
const DEFAULT_ADMIN_PASSWORD = 'admin';

export default class UserController extends Controller {
  constructor() {
    super('users');

    this.router.get('/', this.requireAdmin, this.getAll);
  }

  bootstrap = async () => {
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

  getAll = async ctx => {
    let users = await User.find({});
    users = users.map(u => this.lodash.omit(u.toJSON(), 'password'));
    ctx.body = users;
  };
}

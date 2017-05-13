import bcrypt from 'bcrypt';
import config from '../config';
import { Controller } from '../shared';
import User from './User';
import * as userValidation from './userValidation';

const DEFAULT_ADMIN_USERNAME = 'admin';
const DEFAULT_ADMIN_PASSWORD = 'admin';

const userConstraints = {
  username: userValidation.username,
  password: userValidation.password,
  firstName: userValidation.firstName,
  lastName: userValidation.lastName,
  displayNameUse: userValidation.displayNameUse,
};

export default class UserController extends Controller {
  constructor() {
    super('users');

    this.router.get('/', this.requireAdmin, this.getAll);
    this.router.post(
      '/',
      this.requireAdmin,
      this.validateBody(userConstraints),
      this.create
    );
    this.router.put(
      '/:id',
      this.requireSession,
      this.validateBody(userConstraints),
      this.update
    );
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

  create = async ctx => {
    const newUser = this.lodash.pick(
      ctx.request.body,
      Object.keys(userConstraints)
    );

    if (!newUser.password) {
      ctx.throw(422, 'validation failed', {
        validationErrors: { password: ['password is required'] },
      });
    }

    newUser.isAdmin = false;
    newUser.password = await bcrypt.hash(
      newUser.password,
      config.bcryptSaltRounds
    );

    try {
      await User.create(newUser);
    } catch (err) {
      if (this.lodash.get(err, 'errors.username.kind') === 'unique') {
        ctx.throw(422, 'validation failed', {
          validationErrors: { username: ['username is unavailable'] },
        });
      }
      throw err;
    }
    ctx.body = { message: 'success' };
  };

  update = async ctx => {
    /* eslint-disable no-underscore-dangle */
    const id = ctx.params.id;
    // Only admin can edit accounts belonging to other users
    if (!ctx.state.user.isAdmin && ctx.state.user._id.toString() !== id)
      ctx.throw(401, 'not authorized');

    const user = await User.findById(id);
    if (!user) ctx.throw(404, 'user not found');

    const userUpdate = {
      ...user.toJSON(),
      ...this.lodash.pick(ctx.request.body, Object.keys(userConstraints)),
    };

    if (userUpdate.password) {
      userUpdate.password = await bcrypt.hash(
        userUpdate.password,
        config.bcryptSaltRounds
      );
    }

    await User.findByIdAndUpdate(id, userUpdate);
    ctx.body = { message: 'success' };
    /* eslint-enable */
  };
}

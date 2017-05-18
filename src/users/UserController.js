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
  email: userValidation.email,
  firstName: userValidation.firstName,
  lastName: userValidation.lastName,
  displayNameUse: userValidation.displayNameUse,
};

const restrictToCurrentUser = ctx => {
  /* eslint-disable no-underscore-dangle */
  // Only admin can edit accounts belonging to other users
  if (
    !ctx.state.user.isAdmin &&
    ctx.state.user._id.toString() !== ctx.params.id
  )
    ctx.throw(401, 'not authorized');
  /* eslint-enable */
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
    this.router.del('/:id', this.requireAdmin, this.remove);
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
    if (newUser.email) newUser.email = newUser.email.toLowerCase();

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
    await restrictToCurrentUser(ctx);

    const id = ctx.params.id;
    const user = await User.findById(id);
    if (!user) ctx.throw(404, 'user not found');

    const userUpdate = {
      ...user.toJSON(),
      ...this.lodash.pick(ctx.request.body, Object.keys(userConstraints)),
    };

    // Only encrypt if password was updated, otherwise it will be double
    // encrypted.
    if (ctx.request.body.password) {
      userUpdate.password = await bcrypt.hash(
        userUpdate.password,
        config.bcryptSaltRounds
      );
    }
    if (userUpdate.email) userUpdate.email = userUpdate.email.toLowerCase();

    await User.findByIdAndUpdate(id, userUpdate);
    ctx.body = { message: 'success' };
  };

  remove = async ctx => {
    const id = ctx.params.id;
    await User.findByIdAndRemove(id);
    ctx.body = { message: 'success' };
  };
}

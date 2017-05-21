import bcrypt from 'bcryptjs';
import { Controller } from '../shared';
import { User, userValidation } from '../users';
import generateSecret from './generateSecret';
import * as jwt from './jwt';

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

export const generateJwtToken = (user, secret) => jwt.sign(user, secret);

export default class SessionController extends Controller {
  constructor() {
    super('session');

    this.validateJwtHeaderMiddleware = this.validateHeaders({
      authorization: jwtConstraint,
    });

    this.router.post('/', this.validateBody(loginConstraints), this.login);
    this.router.get('/', this.requireSession, this.profile);
  }

  bootstrap = async () => {
    this.secret = await generateSecret();
  };

  login = async ctx => {
    let foundUser = await User.findOne({
      username: new RegExp(`\\b${ctx.request.body.username}\\b`, 'i'),
    });

    if (
      !foundUser ||
      !await bcrypt.compare(ctx.request.body.password, foundUser.password)
    ) {
      ctx.throw(401, 'username or password is incorrect');
    }

    foundUser = this.lodash.omit(foundUser.toJSON(), 'password');

    const token = await generateJwtToken(foundUser, this.secret);

    ctx.body = {
      message: 'success',
      token,
      profile: foundUser,
    };
  };

  profile = async ctx => {
    const user = await User.findById(ctx.state.user._id);
    if (!user) ctx.throw(401, 'not authorized');

    ctx.body = {
      message: 'success',
      profile: this.lodash.omit(user.toJSON(), 'password'),
    };
  };

  middleware = async (ctx, next) => {
    await this.validateJwtHeaderMiddleware(ctx, async () => {
      if (!ctx.headers.authorization) {
        await next();
        return;
      }

      // Remove "Bearer " from authorization header
      const token = ctx.headers.authorization.slice(7);

      let user;
      try {
        user = await jwt.verify(token, this.secret);
      } catch (err) {
        ctx.throw(401, 'token expired or invalid');
      }

      ctx.state.user = user;

      await next();
    });
  };
}

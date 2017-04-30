import { expect } from 'chai';
import sinon from 'sinon';
import { validUsers, validUserCredentials } from '../test-fixtures';
import { promiseError } from '../test-utils';
import { database } from '../core';
import { User } from '../users';
import SessionController from './SessionController';

const throwMock = (code, msg) => {
  const err = new Error(msg);
  err.status = code;
  throw err;
};

const ctxBody = fields => ({
  request: { body: { ...fields } },
  throw: throwMock,
});

describe('SessionController', () => {
  let controller;

  before(() => database.connect());

  beforeEach(async () => {
    await database.drop();
    await User.create(validUsers);
    controller = new SessionController();
  });

  describe('bootstrap', () => {
    it('generates secret', async () => {
      expect(controller.secret).to.not.exist;
      await controller.bootstrap();
      expect(controller.secret).to.exist;
    });
  });

  describe('login', () => {
    let ctx;

    beforeEach(async () => {
      await controller.bootstrap();
      ctx = ctxBody({
        username: validUserCredentials[0].username,
        password: validUserCredentials[0].password,
      });
    });

    it('throws 401 error on incorrect username', async () => {
      ctx.request.body.username = 'invalid';

      const err = await promiseError(controller.login(ctx));

      expect(err.status).to.equal(401);
    });

    it('throws 401 error on incorrect password', async () => {
      ctx.request.body.password = 'invalid';

      const err = await promiseError(controller.login(ctx));

      expect(err.status).to.equal(401);
    });

    it('returns jwt and profile on success', async () => {
      const err = await promiseError(controller.login(ctx));
      expect(err).to.not.exist;
      expect(ctx.body.message).to.equal('success');
      expect(ctx.body.token).to.exist;
      expect(ctx.body.profile.username).to.equal(validUsers[0].username);
    });
  });

  describe('middleware', () => {
    let ctx;
    let token;
    let next;

    beforeEach(async () => {
      await controller.bootstrap();
      ctx = ctxBody({
        username: validUserCredentials[0].username,
        password: validUserCredentials[0].password,
      });
      await controller.login(ctx);
      token = ctx.body.token;
      ctx = {
        headers: { authorization: `Bearer ${token}` },
        throw: throwMock,
        state: {},
      };
      next = sinon.stub().resolves();
    });

    it('valid auth token sets state to user profile', async () => {
      await controller.middleware(ctx, next);
      expect(ctx.state.user.username).equal(validUsers[0].username);
      expect(next.called).to.be.true;
    });

    it('malformed authentication header throws code 422', async () => {
      ctx.headers.authorization = 'invalid';
      const err = await promiseError(controller.middleware(ctx, next));

      expect(err.status).to.equal(422);
    });

    it('invalid token throws code 401', async () => {
      ctx.headers.authorization = `${ctx.headers.authorization}invalid`;
      const err = await promiseError(controller.middleware(ctx, next));

      expect(err.status).to.equal(401);
    });

    it('no error when no token provided', async () => {
      delete ctx.headers.authorization;
      await controller.middleware(ctx, next);
      expect(ctx.state.user).to.not.exist;
    });
  });
});

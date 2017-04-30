import { expect } from 'chai';
import { validUsers, validUserCredentials } from '../test-fixtures';
import { promiseError } from '../test-utils';
import { database } from '../core';
import { User } from '../users';
import SessionController from './SessionController';

const ctxBody = fields => ({
  request: { body: { ...fields } },
  throw: (code, msg) => {
    const err = new Error(msg);
    err.status = code;
    throw err;
  },
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

    it('returns jwt on success', async () => {
      const err = await promiseError(controller.login(ctx));
      expect(err).to.not.exist;
      expect(ctx.body.message).to.equal('success');
      expect(ctx.body.token).to.exist;
      expect(ctx.body.profile.username).to.equal(validUsers[0].username);
    });
  });
});

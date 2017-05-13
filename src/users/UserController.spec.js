import { expect } from 'chai';
import { koaCtx, validUsers, validUsersDB } from 'test-fixtures';
import { database } from '../core';
import User from './User';
import UserController from './UserController';

const userController = new UserController();

describe('UserController', () => {
  before(async () => {
    await database.connect();
    await database.drop();
  });

  beforeEach(() => User.remove({}));

  describe('bootstrap', () => {
    it('creates default admin user', async () => {
      await userController.bootstrap();

      const existingAdmin = await User.findOne({});
      expect(existingAdmin).to.exist;
      expect(existingAdmin.username).to.equal('admin');
      expect(existingAdmin.isAdmin).to.be.true;
    });
  });

  describe('getAll', () => {
    let ctx;

    beforeEach(async () => {
      await User.create(validUsersDB()[0]);
      await User.create(validUsersDB()[1]);
      ctx = {};
      await userController.getAll(ctx);
    });

    it('returns existing users', () => {
      expect(ctx.body).to.have.length(2);
    });

    it('password field removed', () => {
      expect(ctx.body[0].password).to.not.exist;
    });

    it('returns the JSON representation of the model', () => {
      // Make sure tests are covering the toJSON output that the web server
      // generates and not the model object.
      expect(ctx.body[0]).to.not.have.property('toJSON');
    });
  });

  describe('create', () => {
    let ctx;

    beforeEach(() => {
      ctx = koaCtx();
      ctx.request.body = validUsers()[0];
      // Remove optional field isAdmin
      delete ctx.request.body.isAdmin;
    });

    it('creates user', async () => {
      await userController.create(ctx);
      const user = await User.findOne({});
      expect(user.username).to.equal(validUsers()[0].username);
      expect(ctx.body.message).to.equal('success');
    });

    it('throws validation error on existing user', async () => {
      await User.create(validUsersDB()[0]);

      let err;
      await userController.create(ctx).catch(e => {
        err = e;
      });

      expect(err.status).to.equal(422);
      expect(err.validationErrors.username[0]).to.contain('unavailable');
    });
  });

  describe('update', () => {
    let ctx;

    beforeEach(async () => {
      const user = await User.create(validUsersDB()[0]);
      const id = user._id; // eslint-disable-line no-underscore-dangle
      ctx = koaCtx();
      ctx.params = { id };
    });

    it('updates user account', async () => {
      const userUpdate = {
        username: 'newUsername',
        firstName: 'newFirstName',
        lastName: 'newLastName',
      };
      ctx.request.body = userUpdate;
      await userController.update(ctx);
      const updatedUser = await User.findOne({});
      expect(updatedUser.username).to.equal('newUsername');
      expect(ctx.body.message).to.equal('success');
    });
  });
});

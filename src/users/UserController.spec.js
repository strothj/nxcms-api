import { expect } from 'chai';
import { validUsers } from '../test-fixtures';
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
      await User.create(validUsers[0]);
      await User.create(validUsers[1]);
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
});

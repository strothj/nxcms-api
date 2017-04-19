import { expect } from 'chai';
import { database } from '../core';
import User from './User';
import * as userController from './userController';

const validUsers = [
  {
    username: 'bob',
    password: 'a'.repeat(60),
    displayNameUse: 'username',
    isAdmin: false,
  },
  {
    username: 'jane',
    password: 'a'.repeat(60),
    displayNameUse: 'username',
    isAdmin: false,
  },
];

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

    it('returns existing users', async () => {
      expect(ctx.body).to.have.length(2);
    });

    it('password field removed', async () => {
      expect(ctx.body[0].password).to.not.exist;
    });
  });
});

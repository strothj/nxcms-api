import { expect } from 'chai';
import sinon from 'sinon';
import { database } from '../../core';
import { promiseError } from '../../../test-utils';
import User from './user.model';
import * as controller from './user.controller';

describe('User controller', () => {
  before(async () => {
    await database.connect();
    await database.drop();
  });

  beforeEach(() => User.remove({}));

  describe('signup', () => {
    const newCtx = overrides => ({ request: { body: {
      name: {
        firstName: 'John',
        lastName: 'Doe',
      },
      email: 'user@example.com',
      password: 'a'.repeat(60),
      username: 'user',
      displayNameUse: 'username',
      ...overrides,
    } } });

    it('signs up new user', async () => {
      const ctx = newCtx();

      const err = await promiseError(controller.signup(ctx));

      expect(err).to.not.exist;
      expect(await User.findOne({})).to.exist;
    });

    it('prevents signup as an admin user', async () => {
      const ctxThrow = sinon.stub().throws();
      const ctx = newCtx({ isAdmin: true });
      ctx.throw = ctxThrow;

      await promiseError(controller.signup(ctx));

      expect(ctxThrow.args[0][0]).to.equal(422);
      expect(ctxThrow.args[0][1]).to.contain('isAdmin');
    });

    it('sets default name display preference', async () => {
      const ctx = newCtx();
      delete ctx.request.body.displayNameUse;

      const err = await promiseError(controller.signup(ctx));

      expect(err).to.not.exist;
    });
  });

  describe('unflattenNameFields', () => {
    it('converts flat name fields to name object', async () => {
      const next = sinon.spy();
      const ctx = { request: { body: { firstName: 'John', lastName: 'Doe' } } };
      const expected = { request: { body: { name: { firstName: 'John', lastName: 'Doe' } } } };

      await controller.unflattenNameFields(ctx, next);

      expect(next.called).to.be.true;
      expect(ctx).to.deep.equal(expected);
    });
  });

  describe('encryptPassword', () => {
    const newCtx = overrides => ({
      request: { body: {
        password: 'password',
        verifyPassword: 'password',
        ...overrides,
      } },
      throw: sinon.stub().throws(),
      is: sinon.stub(),
    });
    let next;

    beforeEach(() => { next = sinon.spy(); });

    it('encrypts password', async () => {
      const ctx = newCtx();

      await controller.encryptPassword(ctx, next);

      expect(ctx.request.body.password).to.have.length(60); // bcrypt length
      expect(ctx.request.body.verifyPassword).to.not.exist;
      expect(next.called).to.be.true;
    });

    it('throws error if password length too short', async () => {
      const ctx = newCtx({ password: 'short', verifyPassword: 'short' });

      await promiseError(controller.encryptPassword(ctx, next));

      expect(ctx.throw.args[0][0]).to.equal(422);
      expect(ctx.throw.args[0][1]).to.contain('password too short');
    });

    it('throws error if password and verifyPassword do not match', async () => {
      const ctx = newCtx({ verifyPassword: 'not matching' });

      await promiseError(controller.encryptPassword(ctx, next));

      expect(ctx.throw.args[0][0]).to.equal(422);
      expect(ctx.throw.args[0][1]).to.contain('do not match');
    });

    it('does not require verifyPassword field when called using json', async () => {
      const ctx = newCtx();
      delete ctx.request.body.verifyPassword;
      ctx.is = sinon.stub();
      ctx.is.withArgs('application/json').returns('application/json');

      await controller.encryptPassword(ctx, next);

      expect(ctx.is.called).to.be.true;
    });
  });
});

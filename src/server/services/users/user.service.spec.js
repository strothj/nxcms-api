import { expect } from 'chai';
import { promiseError } from '../../../test-utils';
import { database, errors } from '../../core';
import User from './user.model';
import * as userService from './user.service';

const createSignupParams = fields => ({
  name: {
    firstName: 'John',
    lastName: 'Doe',
  },
  email: 'user@example.com',
  password: 'password',
  verifyPassword: 'password',
  username: 'user',
  isAdmin: false,
  displayNameUse: 'username',
  ...fields,
});

describe('user service', () => {
  before(() => database.connect());

  beforeEach(() => User.remove({}));

  describe('signup', () => {
    it('creates user', async () => {
      const validUser = createSignupParams();

      await userService.signup(validUser);
      const createdUser = await User.findOne({});
      expect(createdUser).to.exist;
    });

    it('rejects if "password" and "verifyPassword" are not equal', async () => {
      const mismatchingPasswords = createSignupParams({ verifyPassword: 'fail' });

      const err = await promiseError(userService.signup(mismatchingPasswords));

      expect(err.code).to.equal(errors.VALIDATION_ERROR);
      expect(err.message).to.have.string('verify password');
    });

    it('rejects if password length too short', async () => {
      const tooShortPassword = createSignupParams({ password: 'fail', verifyPassword: 'fail' });

      const err = await promiseError(userService.signup(tooShortPassword));

      expect(err.code).to.equal(errors.VALIDATION_ERROR);
      expect(err.message).to.have.string('characters long');
    });

    it('sets default value for "displayNameUse" field', async () => {
      const noDisplayNameUseField = createSignupParams({ displayNameUse: undefined });

      const createdUser = await userService.signup(noDisplayNameUseField);

      expect(createdUser.displayNameUse).to.equal('username');
    });

    it('prevents user signing up as admin', async () => {
      const attemptedAdminUser = createSignupParams({ isAdmin: true });

      const createdUser = await userService.signup(attemptedAdminUser);

      expect(createdUser.isAdmin).to.be.false;
    });

    it('accepts name fields from form post', async () => {
      const formSignup = createSignupParams({
        name: undefined,
        firstName: 'John',
        lastName: 'Doe',
      });

      const createdUser = await userService.signup(formSignup);

      expect(createdUser.name.firstName).to.equal('John');
      expect(createdUser.name.lastName).to.equal('Doe');
    });
  });
});

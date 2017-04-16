import mongoose from 'mongoose';
import { expect } from 'chai';
import { promiseError } from '../../../test-utils';
import { database } from '../../core';
import User from './user.model';

const createUser = fields => ({
  name: {
    firstName: 'John',
    lastName: 'Doe',
  },
  email: 'user@example.com',
  password: 'a'.repeat(60),
  username: 'user',
  displayNameUse: 'name',
  isAdmin: false,
  ...fields,
});

describe('User model', () => {
  before(() => database.connect());

  beforeEach(() => User.remove({}));

  it('valid user is created', async () => {
    await User.create(createUser());

    const foundUser = await User.findOne({});
    expect(foundUser).to.exist;
  });

  it('missing fields fail validation', async () => {
    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    const tests = [
      [{ name: undefined }, 'name'],
      [{ name: { firstName: undefined, lastName: 'Doe' } }, 'name.firstName'],
      [{ name: { firstName: 'John', lastName: undefined } }, 'name.lastName'],
      [{ email: undefined }, 'email'],
      [{ password: undefined }, 'password'],
      [{ username: undefined }, 'username'],
      [{ displayNameUse: undefined }, 'displayNameUse'],
      [{ isAdmin: undefined }, 'isAdmin'],
    ];
    // Make sure all fields are accounted for
    expect(tests).to.have.length(Object.keys(User.schema.obj).length + 2);

    for (const t of tests) {
      const invalidUserFields = createUser(t[0]);

      const err = await promiseError(User.create(invalidUserFields));
      expect(err, t[1]).to.be.an.instanceof(mongoose.Error.ValidationError);
    }
    /* eslint-enable no-restricted-syntax, no-await-in-loop */
  });

  it('rejects invalid emails', async () => {
    const invalidUserFields = createUser({ email: 'fail' });

    const err = await promiseError(User.create(invalidUserFields));

    expect(err).to.be.an.instanceof(mongoose.Error.ValidationError);
  });

  it('lowercases emails', async () => {
    const uppercasedEmailUser = createUser({ email: 'USER@example.com' });

    const user = await User.create(uppercasedEmailUser);
    expect(user.email).to.equal('user@example.com');
  });

  it('rejects passwords not 60 length (bcrypt)', async () => {
    const tooShort = createUser({ password: 'a'.repeat(59) });
    let err = await promiseError(User.create(tooShort));
    expect(err).to.be.instanceof(mongoose.Error.ValidationError);

    const tooLong = createUser({ password: 'a'.repeat(61) });
    err = await promiseError(User.create(tooLong));
    expect(err).to.be.instanceof(mongoose.Error.ValidationError);
  });

  it('toJSON returns no sensitive fields', async () => {
    const user = await User.create(createUser());
    expect(user.toJSON()).to.not.have.any.keys(Object.keys(
      User.schema.obj,
    ));
  });

  it('toJSON returns expected fields', async () => {
    const user = await User.create(createUser());
    expect(user.toJSON()).to.have.all.keys([
      '__v', 'updatedAt', 'createdAt', '_id', 'displayName',
    ]);
  });
});

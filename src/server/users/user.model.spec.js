import { expect } from 'chai';
import mongoose from 'mongoose';
import { database } from '../core';
import User from './user.model';

const validUserFields = fields => ({
  name: {
    firstName: 'John',
    lastName: 'Doe',
  },
  email: 'user@example.com',
  password: 'a'.repeat(60),
  ...fields,
});

describe('User model', () => {
  before(() => database.connect());

  beforeEach(() => User.remove({}));

  it('valid user is created', async () => {
    await User.create(validUserFields());

    const createdUser = (await User.findOne({})).toJSON();

    expect(createdUser.name).to.deep.equal(validUserFields().name);
  });

  it('missing fields fail validation', async () => {
    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    const tests = [
      [{ name: undefined }, 'name'],
      [{ name: { firstName: undefined, lastName: 'Doe' } }, 'name.firstName'],
      [{ name: { firstName: 'John', lastName: undefined } }, 'name.lastName'],
      [{ email: undefined }, 'email'],
      [{ password: undefined }, 'password'],
    ];
    // Make sure all fields are accounted for
    expect(tests).to.have.length(Object.keys(User.schema.obj).length + 2);

    let err;
    for (const t of tests) {
      err = null;
      const invalidUserFields = validUserFields(t[0]);

      try { await User.create(invalidUserFields); } catch (e) { err = e; }

      expect(err, t[1]).to.be.an.instanceof(mongoose.Error.ValidationError);
    }
    /* eslint-enable no-restricted-syntax, no-await-in-loop */
  });

  it('rejects invalid emails', async () => {
    const invalidUserFields = validUserFields({ email: 'fail' });

    let err;
    try { await User.create({ invalidUserFields }); } catch (e) { err = e; }

    expect(err).to.be.an.instanceof(mongoose.Error.ValidationError);
  });

  it('lowercases emails', async () => {
    const uppercasedEmailUser = validUserFields({ email: 'USER@example.com' });

    const user = await User.create(uppercasedEmailUser);
    expect(user.email).to.equal('user@example.com');
  });

  it('rejects passwords not 60 length (bcrypt)', async () => {
    /* eslint-disable no-restricted-syntax, no-await-in-loop */
    const tests = [
      [{ password: 'a'.repeat(59) }, 'too short password'],
      [{ password: 'a'.repeat(61) }, 'too long password'],
    ];

    let err;
    for (const t of tests) {
      err = null;
      const invalidPasswordUser = validUserFields(t[0]);

      try { await User.create(invalidPasswordUser); } catch (e) { err = e; }

      expect(err, t[1]).to.be.an.instanceof(mongoose.Error.ValidationError);
    }
    /* eslint-enable no-restricted-syntax, no-await-in-loop */
  });
});

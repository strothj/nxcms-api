import sanitize from 'mongo-sanitize';
import bcrypt from 'bcrypt';
import { errors } from '../../core';
import User from './user.model';

const saltRounds = process.env.NODE_ENV === 'test' ? 1 : 10;

const verifyPasswordMutationFields = ({ password, verifyPassword }) => {
  let err;

  if (password.length < 8) {
    err = new Error('Password validation failed: needs to be at least 8 characters long');
  }

  if (password !== verifyPassword) {
    err = new Error('Password validation failed: verify password did not match');
  }

  if (err) {
    err.code = errors.VALIDATION_ERROR;
    throw err;
  }
};

const encryptPassword = async (doc) => {
  // eslint-disable-next-line no-param-reassign
  doc.password = await bcrypt.hash(doc.password, saltRounds);
};

// eslint-disable-next-line import/prefer-default-export
export const signup = async (unsanitizedDoc) => {
  let doc = sanitize(unsanitizedDoc);

  verifyPasswordMutationFields(doc);
  await encryptPassword(doc);

  doc = {
    ...doc,

    // Convert form post name fields into database fields
    name: doc.name || {
      firstName: doc.firstName,
      lastName: doc.lastName,
    },

    // Set default name display setting
    displayNameUse: doc.displayNameUse || 'username',

    // Prevent user from signing up as an admin
    isAdmin: false,
  };

  return User.create(doc);
};

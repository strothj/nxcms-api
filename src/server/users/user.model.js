import mongoose, { Schema } from 'mongoose';
import isEmail from 'validator/lib/isEmail';
import isAlphanumeric from 'validator/lib/isAlphanumeric';

const nameValidator = {
  type: String,
  required: true,
  maxlength: 200,
  trim: true,
};

const emailValidator = {
  ...nameValidator,
  unique: true,
  lowercase: true,
  validate: {
    validator: isEmail,
    isAsync: false,
  },
  index: true,
};

const passwordValidator = {
  type: String,
  required: true,
  minlength: 60, // bcrypt hash length
  maxlength: 60,
};

const isAdminValidator = {
  type: Boolean,
  required: true,
};

const usernameValidator = {
  type: String,
  required: true,
  unique: true,
  minlength: 4,
  maxlength: 30,
  validate: {
    validator: isAlphanumeric,
    isAsync: false,
  },
  index: true,
};

const displayNameUseValidator = {
  type: String,
  required: true,
  enum: ['name', 'email', 'username'],
};

const schema = new Schema({
  name: {
    firstName: nameValidator,
    lastName: nameValidator,
  },
  email: emailValidator,
  password: passwordValidator,
  username: usernameValidator,
  displayNameUse: displayNameUseValidator,
  isAdmin: isAdminValidator,
}, { timestamps: true });

schema.set('toJSON', {
  transform: (doc, ret) => {
    // Remove sensitive information from api responses.
    /* eslint-disable no-param-reassign */
    Object.keys(schema.obj).forEach((key) => {
      delete ret[key];
    });
    ret.displayName = doc.displayName;
    /* eslint-enable no-param-reassign */
  },
});

schema.virtual('displayName').get(function displayNameGet() {
  switch (this.displayNameUse) {
    case 'name': return `${this.name.firstName} ${this.name.lastName}`;
    case 'email': return this.email;
    default: return this.username;
  }
});

const model = mongoose.model('User', schema);

export default model;

import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import validate from 'validate.js';
import * as validation from './userValidation';

const schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
    validate: { validator: v => !validate.single(v, validation.username) },
  },

  password: {
    type: String,
    required: true,
    minlength: 60, // bcrypt hash length
    maxlength: 60,
  },

  firstName: {
    type: String,
    minlength: 1,
  },

  lastName: {
    type: String,
    minlength: 1,
  },

  displayNameUse: {
    type: String,
    required: true,
    enum: ['name', 'username', 'email'],
  },

  isAdmin: {
    type: Boolean,
    required: true,
  },
});

schema.plugin(uniqueValidator);

const model = mongoose.model('User', schema);

export default model;

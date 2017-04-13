import mongoose, { Schema } from 'mongoose';
import isEmail from 'validator/lib/isEmail';

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
};

const passwordValidator = {
  type: String,
  required: true,
  maxlength: 60, // bcrypt hash length
  minlength: 60,
};

const schema = new Schema({
  name: {
    firstName: nameValidator,
    lastName: nameValidator,
  },
  email: emailValidator,
  password: passwordValidator,
});

const model = mongoose.model('User', schema);

export default model;

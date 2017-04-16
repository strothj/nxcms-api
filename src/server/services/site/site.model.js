import mongoose, { Schema } from 'mongoose';

const schema = new Schema({
  title: {
    type: String,
    default: '',
  },
  tagline: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

const model = mongoose.model('Site', schema);

export default model;

import mongoose, { Schema } from 'mongoose';

const schema = new Schema({
  editor: { type: mongoose.Schema('User'), required: true },

  publishDate: Date,

  title: { type: String, required: true },

  headerImageURL: { type: String, required: true },

  headerImageAttributionURL: { type: String, required: true },

  headerImageAttributionText: { type: String, required: true },

  slug: { type: String, required: true },

  category: { type: String, required: true },

  tags: [String],

  synopsis: String,

  content: { type: String, required: true },
});

const model = mongoose.model('Article', schema);

export default model;

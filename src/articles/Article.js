import mongoose, { Schema } from 'mongoose';

const schema = new Schema({
  editor: { type: Schema.Types.ObjectId, required: true },

  publishDate: Date,

  title: { type: String, required: true },

  headerImageURL: { type: String, required: true },

  headerImageAttributionURL: String,

  headerImageAttributionText: String,

  slug: { type: String, required: true, unique: true },

  category: { type: String, required: true },

  tags: [String],

  synopsis: String,

  youtubeVideoID: String,

  content: { type: String, required: true },
});

const model = mongoose.model('Article', schema);

export default model;

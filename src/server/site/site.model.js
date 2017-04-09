import mongoose, { Schema } from 'mongoose';

const siteSchema = new Schema({
  title: String,
  tagline: String,
});


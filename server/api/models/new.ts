import mongoose from "mongoose";
import sequence from "mongoose-sequence";
import { Deleted } from './deleted';

const AutoIncrement = sequence(mongoose);

export interface INewsModel extends mongoose.Document {
    author: String,
    title: String,
    story_title: String,
    url: String,
    story_url: String,
    created_at: String,
    show: Boolean,
}

const schema = new mongoose.Schema(
  {
    author: String,
    title: String,
    story_title: String,
    url: String,
    story_url: String,
    created_at: String,
    show: {type: Boolean, default: true},
  },
  {
    collection: "news",
  }
);

export const New = mongoose.model<INewsModel>("New", schema);

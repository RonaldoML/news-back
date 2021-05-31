import mongoose from "mongoose";

export interface IDeletedModel extends mongoose.Document {
  title: String;
  tag: String;
}

const schema = new mongoose.Schema(
  {
    title: String,
    tag: String,
  },
  {
    collection: "deleted",
  }
);

export const Deleted = mongoose.model < IDeletedModel > ("Deleted", schema);

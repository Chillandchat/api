import { ContentSchemaType } from "./../utils/index.d";
import mongoose from "mongoose";

/**
 * This is the content document schema, this is used to define an instance of a uploaded file.
 * @see {ContentSchemaType}
 */

const schema: any = new mongoose.Schema({
  type: String,
  id: String,
  url: String,
  user: String,
});

const content: mongoose.Model<any> = mongoose.model<ContentSchemaType>(
  "content",
  schema
);

export default content;

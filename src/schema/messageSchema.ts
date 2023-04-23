import mongoose from "mongoose";

import { MessageSchemaType } from "../utils";

/**
 * This is the message schema for the database, please see './type.d.ts' for more information.
 * @see {MessageSchemaType}
 */

const schema: any = new mongoose.Schema({
  id: String,
  user: String,
  content: String,
  room: String,
});

const message: mongoose.Model<any> = mongoose.model<MessageSchemaType>(
  "message",
  schema
);

export default message;

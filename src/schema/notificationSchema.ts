import mongoose from "mongoose";

import { NotificationSchemaType } from "../utils";

/**
 * This is the notification schema for the database, please see './type.d.ts' for more information.
 * @see {NotificationSchemaType}
 */

const schema: any = new mongoose.Schema({
  id: String,
  token: String,
});

const message: mongoose.Model<any> = mongoose.model<NotificationSchemaType>(
  "notification",
  schema
);

export default message;

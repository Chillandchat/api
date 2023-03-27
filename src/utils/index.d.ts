import mongoose from "mongoose";

/**
 * This is the database schema for the message object in mongoDB database.
 *
 * @param {string} id The id of the message.
 * @param {string} message The user that sent the message.
 * @param {string} content The content of the message.
 * @param {boolean} verified Whether the sender of the message is verified.
 * @param {string} iconColor The color of the icon.
 * @param {string} description The description of the user.
 * @param {number} followers The number of followers of the user.
 * @param {string} following The users that the user is following.
 */

export interface AuthSchemaType extends mongoose.Document {
  id: string;
  username: string;
  password: string;
  verified: boolean;
  bot: boolean;
  blocked: boolean;
  iconColor: string;
  followers: number;
  description: string;
  following: Array<string>;
}

/**
 * This is the database schema for the message object in mongoDB database.
 *
 * @param {string} id The id of the message.
 * @param {string} message The user that sent the message.
 * @param {string} content The content of the message.
 * @param {string} room The room that sent the message.
 */

export interface MessageSchemaType extends mongoose.Document {
  id: string;
  user: string;
  content: string;
  room: string;
}

/**
 * This is the database schema for the message room object in mongoDB database.
 *
 * @param {string} id The id of the message room.
 * @param {string} name The name of the message room.
 * @param {string} users The users in the message room.
 * @param {string} iconColor The color of the icon.
 * @param {boolean} public Weather the room is public or not.
 */

export interface RoomSchemaType extends mongoose.Document {
  id: string;
  name: string;
  users: Array<string>;
  passcode: string;
  iconColor: string;
  public: boolean;
}

/**
 * This is the content schema type, this is a outline of the database schema.
 *
 * @param {string} id The id of the uploaded content.
 * @param {ContentType} type The type of the content.
 * @param {string} url The url source of the uploaded content.
 * @param {string} user The username of the user who created the content.
 */

export interface ContentSchemaType extends mongoose.Document {
  id: string;
  type: ContentType;
  url: string;
  user: string;
}

/**
 * This is the notification schema type, this ia a outline of the database schema.
 *
 * @param {string} user The user of the notification token for reference.
 * @param {string} token The token for notification services.
 */

export interface NotificationSchemaType extends mongoose.Document {
  user: string;
  token: string;
}
/**
 * This is the content type type. The type defines the supported upload types to the Chill&chat cloud.
 */

export type ContentType = "CHILL&CHAT_GIF" | "CHILL&CHAT_IMG";

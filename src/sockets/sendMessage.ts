import { io, messageCache } from "..";
import message from "../schema/messageSchema";
import { MessageSchemaType } from "../utils";
import debug from "../utils/debug";
import sendNotifications from "../utils/sendNotification";

/**
 * This is the send message socket isolation functioned,
 * designed to avoid code clutter and debugging pains in the socket.io handler.
 *
 * @param {MessageSchemaType} payload The payload of the message.
 * @param {string} key The key to authenticate the request.
 * @param {string} responseToken The token to respond to.
 *
 * @note This is a socket used by the socket.io handler.
 * @see https://socket.io/ For more information about socket.io.
 */

const sendMessage = async (
  payload: MessageSchemaType,
  key: string,
  responseToken: string
): Promise<void> => {
  if (key === process.env.KEY) {
    await sendNotifications(payload.room, payload);

    const messageObject: Object = {
      id: payload.id,
      user: payload.user,
      content: payload.content,
      room: payload.room,
    };

    io.emit(`client-message:room(${payload.room})`, payload);
    const newMessage = new message(messageObject);
    await newMessage
      .save()
      .then((createdMessage: MessageSchemaType): void => {
        if (messageCache.get(payload.room) !== undefined) {
          messageCache.set(
            payload.room,
            // @ts-ignore
            messageCache.get(payload.room)?.concat(createdMessage)
          );
        } else {
          message
            .find({ room: { $eq: payload.room } })
            .then((messages: Array<MessageSchemaType>): void => {
              messageCache.set(payload.room, messages);
            });
        }
        io.emit(`sent:token(${responseToken})`);
        debug.log(`Message: ${payload.id} saved and emitted.`);
      })
      .catch((err: unknown): void => {
        io.emit(`error:token(${responseToken})`, err);
      });
  } else {
    io.emit(`error:token(${responseToken})`, "Invalid key");
  }
};

export default sendMessage;

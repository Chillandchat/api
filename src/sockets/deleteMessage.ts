import { io, messageCache } from "../index";
import content from "../schema/contentSchema";
import message from "../schema/messageSchema";
import { MessageSchemaType } from "../utils";
import debug from "../utils/debug";

/**
 * This is the delete message socket isolation functioned,
 * designed to avoid code clutter and debugging pains in the socket.io handler.
 *
 * @param {string} id The id of the message to delete.
 * @param {string} room The room of the message to delete.
 * @param {string} responseToken The token to respond to.
 * @param {string} key The key to authenticate the request.
 *
 * @note This is a socket used by the socket.io handler.
 * @see https://socket.io/ For more information about socket.io.
 */

const deleteMessage = async (
  id: string,
  room: string,
  responseToken: string,
  key: string
): Promise<void> => {
  if (key === process.env.KEY) {
    await message
      .findOne({ id: { $eq: id } })
      .then(async (messageData: MessageSchemaType): Promise<void> => {
        if (
          await content.exists({
            url: {
              $eq: messageData.content.slice(3, messageData.content.length - 1),
            },
          })
        ) {
          await content.findOneAndDelete({
            url: {
              $eq: messageData.content.slice(3, messageData.content.length - 1),
            },
          });
        }

        await message
          .findOneAndDelete({ id: { $eq: id } })
          .then((): void => {
            message
              .find({ room: { $eq: room } })
              .then((messages: Array<MessageSchemaType>): void => {
                messageCache.set(room, messages);
              });

            io.emit(`client-message-delete:room(${room})`, id);
            io.emit(`deleted:token(${responseToken})`);
            debug.log(`Deleted message ${id}`);
          })
          .catch((err: unknown): void => {
            io.emit(`error:token(${responseToken})`, err);
          });
      })
      .catch((err: unknown): void => {
        io.emit(`error:token(${responseToken})`, err);
      });
  } else io.emit(`error:token(${responseToken})`, "Invalid key");
};

export default deleteMessage;

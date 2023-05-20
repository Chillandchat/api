import { io } from "../index";
import debug from "../utils/debug";

/**
 * This is the keyboard socket isolation functioned,
 * designed to avoid code clutter and debugging pains in the socket.io handler.
 *
 * @param {string} room The room of the keyboard event handler.
 * @param {string} user The user that is typing.
 * @param {string} key The key to authenticate the request.
 * @param {string} responseToken The token to respond to.
 * @param {"start" | "stop"} mode The mode of the keyboard.
 *
 * @note This is a socket used by the socket.io handler.
 * @see https://socket.io/ For more information about socket.io.
 */

const keyboard = (
  room: string,
  user: string,
  key: string,
  responseToken: string,
  mode: "start" | "stop"
): void => {
  if (key === process.env.KEY) {
    if (mode === "start") {
      debug.log(`${user} is now typing.`);
      io.emit(`typing:token(${responseToken})`);
    } else {
      debug.log(`${user} is now stopped typing`);
      io.emit(`stopped-typing:token(${responseToken})`);
    }
    io.emit(`keyboard-${mode}:room(${room})`, user);
  } else io.emit(`error:token(${responseToken})`, "Invalid key");
};

export default keyboard;

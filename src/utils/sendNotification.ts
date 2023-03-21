// @ts-ignore
import { Expo } from "expo-server-sdk";

import { MessageSchemaType, RoomSchemaType } from "./index.d";
import { NotificationSchemaType } from "./index.d";
import notification from "../schema/notificationSchema";
import rooms from "../schema/roomSchema";
import debug from "./debug";

/**
 *
 * @param room
 * @param data
 */

const sendNotifications = async (
  room: string,
  data: MessageSchemaType
): Promise<void> => {
  let tokens: Array<string> = [];

  const expo = new Expo();

  await rooms
    .findOne({ name: room })
    .then((returnedRoom: RoomSchemaType): void => {
      returnedRoom.users.forEach(async (user: string): Promise<void> => {
        await notification
          .findOne({ user: user })
          .then((element: NotificationSchemaType): void => {
            tokens.push(element.token.toString());
          });
      });
    });

  for (let i: number = 0; i < tokens.length; i++) {
    if (expo.isExpoPushToken(tokens[i])) {
      debug.log(
        `${tokens[i]} cannot be found as an exponent push notification key!`
      );
      return;
    }
  }

  await expo.sendPushNotificationAsync({
    to: tokens,
    title: `${data.user.toString()} sent ${
      data.content.includes("!IMG") ? "an image" : "a message"
    } to you!`,
    body: data.content.includes("!IMG")
      ? "<Image>"
      : data.content.includes("!FMT")
      ? "<Chill&chat embed format>"
      : data.content,
    sound: "default",
    data: data,
  });
};

export default sendNotifications;

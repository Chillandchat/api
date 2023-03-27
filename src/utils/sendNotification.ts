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
    .findOne({ id: { $eq: room } })
    .then(async (returnedRoom: RoomSchemaType): Promise<void> => {
      await Promise.all(
        returnedRoom.users
          .filter((user: string): boolean => user !== data.user)
          .map(async (user: string): Promise<void> => {
            await notification
              .findOne({ user: { $eq: user } })
              .then((element: NotificationSchemaType): void => {
                if (element !== null) {
                  tokens.push(element.token.toString());
                }
              });
          })
      );
    });

  console.log(tokens);
  for (let i: number = 0; i < tokens.length; i++) {
    if (!Expo.isExpoPushToken(tokens[i])) {
      debug.error(
        `${tokens[i]} cannot be found as an exponent push notification key!`
      );
      return;
    }
  }

  tokens.length > 0
    ? await expo.sendPushNotificationsAsync([
        {
          to: tokens,
          title: `${data.user.toString()} sent ${
            data.content.includes("!IMG") ? "an image" : "a message"
          } to you!`,
          body: data.content.includes("!IMG")
            ? ""
            : data.content.includes("!FMT")
            ? "<Chill&chat embed format>"
            : data.content,
          sound: "default",
          data: { message: data, "content-available": 1 },
        },
      ])
    : undefined;
};

export default sendNotifications;

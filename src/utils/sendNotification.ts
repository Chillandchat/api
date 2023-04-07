import { Expo } from "expo-server-sdk";

import { MessageSchemaType, RoomSchemaType } from "./index.d";
import { NotificationSchemaType } from "./index.d";
import notification from "../schema/notificationSchema";
import rooms from "../schema/roomSchema";
import debug from "./debug";

/**
 * This is the send notifications function, this function will be responsible
 * for sending a notification to the expo push server.
 *
 * As mentioned in the expo documentation, the push server will send a native
 * notification to the correspondent server such as Firebase.
 *
 * @param {string} room The room the message was sent in.
 * @param {MessageSchemaType} data The message body or data.
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
      room = returnedRoom.name;
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
          title: room.toString(),
          body: `${data.user}: ${
            data.content.includes("!FMT")
              ? "<Formatted message>"
              : data.content.includes("!IMG")
              ? "<Embedded image>"
              : data.content
          }`,
          sound: "default",
          data: { message: data, "content-available": 1 },
        },
      ])
    : undefined;
};

export default sendNotifications;

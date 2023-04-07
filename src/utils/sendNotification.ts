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
  const expo = new Expo();

  await rooms
    .findOne({ id: { $eq: room } })
    .exec()
    .then(async (returnedRoom: RoomSchemaType): Promise<void> => {
      room = returnedRoom.name;

      returnedRoom.users.map(async (user: string): Promise<void> => {
        if (user !== data.user) {
          await notification
            .findOne({ user: { $eq: user } })
            .exec()
            .then((element: NotificationSchemaType): void => {
              if (!element) return;

              if (!Expo.isExpoPushToken(element.token)) {
                debug.error(
                  `${element.token} cannot be found as an exponent push notification key!`
                );
                return;
              }

              expo.sendPushNotificationsAsync([
                {
                  to: element.token,
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
              ]);
            });
        }
      });
    });
};

export default sendNotifications;

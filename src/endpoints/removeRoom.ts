import { NextFunction, Request, Response } from "express";

import { MessageSchemaType, RoomSchemaType } from "./../utils/index.d";
import debug from "../utils/debug";
import roomSchema from "../schema/roomSchema";
import messageSchema from "../schema/messageSchema";

/**
 * This is the remove room endpoint, this endpoint will remove a user from the room's users array
 *
 * @type {POST} This is a post endpoint.
 * @param {string} id The room id.
 * @param {string} user The user to be removed from the room.
 * @returns {string} Returns a string of the status message.
 */

const removeRoom = async (req: Request, res: Response, _next: NextFunction) => {
  if (req.query.key !== String(process.env.KEY)) {
    res.status(401).send("Invalid api key.");
    return;
  }

  try {
    await roomSchema
      .findOne({ id: { $eq: req.body.id } })
      .then(async (room: RoomSchemaType): Promise<void> => {
        if (room.users.indexOf(req.body.user) !== -1) {
          await roomSchema
            .findOneAndUpdate(
              { id: { $eq: req.body.id } },
              { $pull: { users: req.body.user } }
            )
            .exec()
            .then(async (): Promise<void> => {
              await roomSchema
                .findOne({ id: { $eq: req.body.id } })
                .then(async (room: RoomSchemaType): Promise<void> => {
                  if (room.users.length > 0) {
                    res.status(200).send("User removed from room.");
                    debug.log(
                      `${req.body.user} removed from room ${req.body.id}`
                    );
                  } else {
                    await roomSchema
                      .findOneAndDelete({ id: { $eq: req.body.id } })
                      .exec()
                      .then(async (): Promise<void> => {
                        await messageSchema
                          .find({ room: { $eq: req.body.id } })
                          .then((messages: Array<MessageSchemaType>): void => {
                            messages.forEach(
                              async (
                                message: MessageSchemaType
                              ): Promise<void> => {
                                await messageSchema
                                  .findOneAndDelete({ id: message.id })
                                  .exec();
                              }
                            );
                            res
                              .status(200)
                              .send("User removed from room and room deleted");
                            debug.log(
                              `${req.body.user} removed from room ${req.body.id} and deleted room.`
                            );
                          });
                      });
                  }
                });
            });
        } else {
          res.status(400).send("User not present in the room.");
        }
      });
  } catch (err: unknown) {
    res.status(500).send(err);
    debug.error(err);
  }
};

export default removeRoom;

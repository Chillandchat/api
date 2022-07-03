import { RoomSchemaType } from "./../utils/index.d";
import { NextFunction, Request, Response } from "express";
import debug from "../utils/debug";

import roomSchema from "../schema/roomSchema";

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
      .findOne({ id: req.body.id })
      .then(async (room: RoomSchemaType): Promise<void> => {
        if (room.users.indexOf(req.body.user) !== -1) {
          await roomSchema
            .findOneAndUpdate(
              { id: req.body.id },
              { $pull: { users: req.body.user } }
            )
            .exec()
            .then((): void => {
              res.status(200).send("User removed from room.");
              debug.log(`${req.body.user} removed from room ${req.body.id}`);
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

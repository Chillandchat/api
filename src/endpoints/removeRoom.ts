import { NextFunction, Request, Response } from "express";
import debug from "../utils/debug";

import roomSchema from "../schema/roomSchema";

/**
 * This is the remove room endpoint, this endpoint will remove a user from the room's users array
 *
 * !!! This endpoint is not ready for production !!!
 * @experimental
 *
 * @type {POST} This is a post endpoint.
 * @param {string} id The room id.
 * @param {string} user The user to be removed from the room.
 * @returns {string} Returns a string of the status message.
 */

const removeRoom = async (req: Request, res: Response, _next: NextFunction) => {
  return;
  
  if (req.query.key !== String(process.env.KEY)) {
    res.status(401).send("Invalid api key.");
    return;
  }

  try {
    await roomSchema
      .findOneAndUpdate(
        { id: req.body.id },
        { $pull: { users: req.body.user } }
      )
      .exec()
      .then(() => {
        res.status(200).send("User removed from room.");
        debug.log(`${req.body.user} removed from room ${req.body.id}`);
      });
  } catch (err: unknown) {
    res.status(500).send(err);
    debug.error(err);
  }
};

export default removeRoom;

import { NextFunction, Request, Response } from "express";

import { RoomSchemaType } from "./../utils/index.d";
import debug from "../utils/debug";
import rooms from "../schema/roomSchema";

/**
 * This is the get public rooms endpoint, this endpoint will as the name suggests send all the public rooms to the client
 *
 * @type {GET} This is a get typed endpoint
 * @returns {Array<RoomSchemaType>} Returns the rooms in a room schema type format.
 */

const getPublicRooms = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  if (req.query.key !== String(process.env.KEY)) {
    res.status(401).send("Invalid api key.");
    return;
  }

  try {
    await rooms
      .find({ public: true })
      .exec()
      .then((rooms: Array<RoomSchemaType>): void => {
        res.status(200).send(rooms);
        debug.log("Sent all public rooms.");
      })
      .catch((err: unknown): void => {
        res.status(500).send(`SERVER ERROR: ${err}`);
        debug.error(err);
      });
  } catch (err: unknown) {
    res.status(500).send(`SERVER ERROR: ${err}`);
    debug.error(err);
  }
};

export default getPublicRooms;

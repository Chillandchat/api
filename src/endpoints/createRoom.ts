import { NextFunction, Request, Response } from "express";
import randomColor from "randomcolor";
import bcrypt from "bcrypt";

import roomSchema from "../schema/roomSchema";
import debug from "../utils/debug";

/**
 * This is the create room endpoint, this endpoint will create a room once called.
 *
 * @param {string} id The id of the room the new room
 * @param {string} name The name of the room.
 * @param {string} user The users in the room.
 * @param {string | null} passcode The passcode of the room.
 * @param {boolean} public If the room is public
 * @returns {string} The function will return the status of the request.
 */

const createRoom = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  if (req.query.key !== String(process.env.KEY)) {
    res.status(401).send("Invalid api key.");
    return;
  }

  try {
    if (req.body.passcode === null && !req.body.public)
      res
        .status(400)
        .send("ERROR: Password must be not null in private rooms.");

    await new roomSchema({
      id: req.body.id,
      name: req.body.name,
      users: [req.body.user],
      passcode:
        req.body.passcode !== null
          ? await bcrypt.hash(req.body.passcode, await bcrypt.genSaltSync())
          : null,
      iconColor: randomColor(),
      public: req.body.public,
    })
      .save()
      .then((): void => {
        res.status(201).send("Room created.");

        debug.log(`Room ${req.body.id} created.`);
      });
  } catch (err: unknown) {
    res.status(500).send(err);

    debug.error(err);
  }
};

export default createRoom;

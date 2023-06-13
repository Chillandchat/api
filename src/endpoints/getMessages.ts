import { NextFunction, Request, Response } from "express";

import { MessageSchemaType } from "../utils";
import debug from "../utils/debug";
import message from "../schema/messageSchema";
import { messageCache } from "../utils/cache";

/**
 * This is the get message endpoint, this endpoint is used to get messages in the database.
 *
 * @type {GET} This is a get type endpoint.
 * @param {string }room The id of the room to search from.
 * @returns {Array<MessageSchemaType> | string} Returns a array of messages or a error message in a string formatt, @see type.d.ts for more information.
 */

const getMessages = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  if (req.query.key !== String(process.env.KEY)) {
    res.status(401).send("Invalid api key.");
    return;
  }

  try {
    if (messageCache.get(String(req.query.room)) !== undefined) {
      res.status(200).send(messageCache.get(String(req.query.room)));
      debug.log("Found messages in cache.");
      return;
    }

    await message
      .find({ room: { $eq: req.query.room } })
      .exec()
      .then((data: Array<MessageSchemaType>): void => {
        res.status(200).send(data);
        messageCache.set(String(req.query.room), data);
        debug.log("Found messages and added to cache.");
      });
  } catch (err: unknown) {
    res.status(500).send(err);

    debug.error(err);
  }
};

export default getMessages;

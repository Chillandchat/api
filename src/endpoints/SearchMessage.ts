import { NextFunction, Request, Response } from "express";

import messageSchema from "../schema/messageSchema";
import { MessageSchemaType } from "../utils";
import debug from "../utils/debug";
import { messageCache } from "..";

/**
 * This is the search message endpoint, this endpoint will return a message of the given id.
 *
 * @type {POST} This is a post typed endpoint.
 * @param {string} id The id of the message that is being searched for.
 * @returns {string | MessageSchemaType} Returns the result of the search in a string format or the message in the message schema type.
 */

const searchMessage = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  if (req.query.key !== String(process.env.KEY)) {
    res.status(401).send("Invalid api key.");
    return;
  }

  try {
    if (messageCache.get(String(req.body.id)) !== undefined) {
      const result: MessageSchemaType = messageCache
        .get(String(req.body.id))
        // @ts-ignore
        ?.find(
          (message: MessageSchemaType) => message.id === req.body.id
        ) as MessageSchemaType;
      res.status(200).send(result);
      debug.log(`Message ${req.body.id} has been found in cache.`);
      return;
    }

    await messageSchema
      .findOne({ id: { $eq: req.body.id } })
      .then((data: MessageSchemaType | null | undefined) => {
        if (data !== null || data !== undefined) {
          res.status(200).send(data);
          debug.log(`Message ${req.body.id} has been found.`);
        } else {
          res.status(400).send("No message found.");
        }
      });
  } catch (err: unknown) {
    res.status(500).send(`SERVER ERROR: ${err}`);

    debug.error(err);
  }
};

export default searchMessage;

import { NextFunction, Request, Response } from "express";

import messageSchema from "../schema/messageSchema";
import { MessageSchemaType } from "../utils";
import debug from "../utils/debug";

/**
 * This is the search message endpoint, this endpoint will retrun a message of the given id.
 *
 * @type {POST} This is a post typed endpoint.
 * @param {string} id The id of the message that is being searched for.
 * @returns {string | MessageSchemaType} Returns the result of the search in a string format or the message in the messageschema type.
 */

const seachMessage = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  if (req.query.key !== String(process.env.KEY)) {
    res.status(401).send("Invalid api key.");
    return;
  }

  try {
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

export default seachMessage;

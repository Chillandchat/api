import { NextFunction, Request, Response } from "express";

import user from "../schema/authSchema";
import { AuthSchemaType } from "../utils";
import debug from "../utils/debug";

/**
 * This is the get key endpoint, this endpoint as the name suggests will send the key.
 * This endpoint the cli so it can access the api.
 *
 * @experimental
 * @type {GET} This is a get typed endpoint.
 * @param {string} botKey The bot key provided from the bot utility.
 */

const getKey = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  if (req.query.key !== String(process.env.KEY)) {
    res.status(401).send("Invalid api key.");
    return;
  }

  try {
    await user
      .findOne({ id: { $eq: req.query.botKey } })
      .exec()
      .then(async (data: AuthSchemaType | null | undefined): Promise<void> => {
        if (data !== null && data !== undefined) {
          if (data.bot) {
            res.status(200).send(process.env.API_KEY);
          }
        }
      });
  } catch (err: unknown) {
    res.status(500).send(err);
    debug.error(err);
  }
};

export default getKey;

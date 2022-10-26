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
  try {
    if (!req.query.botKey.toString().includes(process.env.BOT_KEY_PASS)) {
      res.status(401).send("Invalid bot key!");
      return;
    }

    await user
      .findOne({
        id: {
          $eq: req.query.botKey
            .toString()
            .replace(process.env.BOT_KEY_PASS, ""),
        },
      })
      .exec()
      .then(async (data: AuthSchemaType | null | undefined): Promise<void> => {
        if (data !== null && data !== undefined && data.bot) {
          res.status(200).send(Buffer.from(process.env.KEY).toString("base64"));
        } else {
          res.status(401).send("Invalid bot key!");
          return;
        }
      });
  } catch (err: unknown) {
    res.status(500).send(err);
    debug.error(err);
  }
};

export default getKey;

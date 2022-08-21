import { NextFunction, Request, Response } from "express";

import { AuthSchemaType } from "../utils";
import debug from "../utils/debug";
import user from "../schema/authSchema";

/**
 * This endpoint is used to block a user from Chill&chat.
 *
 * @type {POST} This is a post endpoint
 * @param {string} user The user to block.
 * @param {boolean} blockStatus Whether the user should be blocked.
 * @returns {string} Returns the result in string format.
 */

const blockUser = async (
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
      .findOneAndUpdate(
        { username: { $eq: req.body.user } },
        { blocked: { $eq: req.body.blockStatus } }
      )
      .exec()
      .then((data: AuthSchemaType | null | undefined): void => {
        if (data != null || data != undefined) {
          res.status(200).send("User blocked or unblocked.");

          debug.log(`User ${req.body.user} blocked or unblocked.`);
        } else res.status(400).send("User not found.");
      });
  } catch (err: unknown) {
    res.status(500).send(err);
    debug.error(err);
  }
};
export default blockUser;

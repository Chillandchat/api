import { NextFunction, Request, Response } from "express";

import user from "../schema/authSchema";
import debug from "../utils/debug";

/**
 * This is the update icon color endpoint, this endpoint as the name suggests, this endpoint will update a user's icon color.
 *
 * @experimental
 * @type {POST} The is a post typed endpoint.
 * @param {string} user The user to change the icon color.
 * @param {string} color The color to change the icon to.
 *
 * @note Please make sure that the color is in a hex format: #0000 - Black #ffff - White, RGB values are not allowed!
 */

const updateIconColor = async (
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
        { $set: { iconColor: req.body.color } }
      )
      .exec()
      .then((): void => {
        res
          .status(200)
          .send(
            `${req.body.user}'s icon color has been changed to ${req.body.color}`
          );
        debug.log(
          `${req.body.user}'s icon color has been changed to ${req.body.color}`
        );
      });
  } catch (err: unknown) {
    res.status(500).send(`SERVER ERROR: ${err}`);
    debug.error(err);
  }
};

export default updateIconColor;

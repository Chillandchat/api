import { NextFunction, Request, Response } from "express";

import debug from "../utils/debug";
import userSchema from "../schema/authSchema";

/**
 * This is the update description endpoint, this endpoint will update a user's description.
 * 
 * @experimental
 * @type {POST} This is a post typed endpoint.
 * @param {string} username The username of the user to update the description of.
 * @param {string} description The new description of the user.
 */

const updateDescription = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  if (req.query.key !== String(process.env.KEY)) {
    res.status(401).send("Invalid api key.");
    return;
  }

  try {
    await userSchema
      .findOneAndUpdate(
        { username: { $eq: req.body.username } },
        { $set: { description: req.body.description } }
      )
      .exec()
      .then((): void => {
        debug.log(`${req.body.username}'s description has been updated.`);
        res.status(200).send("Description updated successfully.");
      });
  } catch (err: unknown) {
    res.status(500).send(err);

    debug.error(err);
  }
};

export default updateDescription;

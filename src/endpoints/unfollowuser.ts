import { AuthSchemaType } from "./../utils/index.d";
import { NextFunction, Request, Response } from "express";

import userSchema from "../schema/authSchema";
import debug from "../utils/debug";

/**
 * This is the unfollow user page this is the endpoint is used to unfollow a user.
 *
 * @type {POST} This is a post typed endpoint.
 * @param {string} targetUser The user to unfollow.
 * @param {string} user The user that is unfollowing.
 */

const unfollowUser = async (
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
      .findOne({ username: { $eq: req.body.targetUser } })
      .exec()
      .then(async (user: AuthSchemaType): Promise<void> => {
        if (user === null) {
          debug.error("User does not exist.");
          res.status(400).send("User does not exist.");

          return;
        }

        if (user.followers - 1 >= 0) {
          await userSchema
            .findOneAndUpdate(
              { username: { $eq: req.body.targetUser } },
              { $inc: { followers: -1 } }
            )
            .exec()
            .then(async (): Promise<void> => {
              await userSchema
                .findOneAndUpdate(
                  { username: { $eq: req.body.user } },
                  { $pull: { following: req.body.targetUser } }
                )
                .exec()
                .then((): void => {
                  debug.log(`${req.body.targetUser} has been unfollowed.`);
                  res.status(201).send("Unfollowed successfully.");
                });
            });
        } else {
          debug.error("User cannot have a negative follower count.");
          res.status(400).send("User cannot have negative follower count.");
        }
      });
  } catch (err: unknown) {
    res.status(500).send(err);

    debug.error(err);
  }
};

export default unfollowUser;

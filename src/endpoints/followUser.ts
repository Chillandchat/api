import { NextFunction, Request, Response } from "express";

import userSchema from "../schema/authSchema";
import { AuthSchemaType } from "../utils";
import debug from "../utils/debug";

/**
 * This is the follow user page this is the endpoint is used to follow a user.
 *
 * @type {POST} This is a post typed endpoint.
 * @param {string} targetUser The user to follow.
 * @param {string} user The user that is following.
 */

const followUser = async (
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

        await userSchema
          .findOne({ username: { $eq: req.body.user } })
          .exec()
          .then(async (user: AuthSchemaType): Promise<void> => {
            if (!user.following.includes(req.body.targetUser)) {
              await userSchema
                .findOneAndUpdate(
                  { username: { $eq: req.body.targetUser } },
                  { $inc: { followers: 1 } }
                )
                .exec()
                .then(async (): Promise<void> => {
                  await userSchema
                    .findOneAndUpdate(
                      { username: { $eq: req.body.user } },
                      { $push: { following: req.body.targetUser } }
                    )
                    .exec()
                    .then((): void => {
                      debug.log(`${req.body.targetUser} has been followed.`);
                      res.status(200).send("Followed successfully.");
                    });
                });
            } else {
              debug.error("User is already following this user.");
              res.status(400).send("User is already following this user.");
            }
          });
      });
  } catch (err: unknown) {
    res.status(500).send(err);

    debug.error(err);
  }
};

export default followUser;

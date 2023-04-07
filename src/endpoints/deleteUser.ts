import { Request, Response, NextFunction } from "express";

import notification from "../schema/notificationSchema";
import { AuthSchemaType } from "../utils/index.d";
import userSchema from "../schema/authSchema";
import debug from "../utils/debug";
import messages from "../schema/messageSchema";

/**
 * This is the delete user endpoint. This endpoint will as the name suggests,
 * Delete the provided user in the user field.
 *
 * @type {POST} This is a get typed endpoint.
 * @param {string} user The user to delete.
 */

const deleteUser = async (
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
      .findOne({ username: { $eq: req.body.user } })
      .exec()
      .then(async (user: AuthSchemaType): Promise<void> => {
        if (user === null) {
          debug.error("User does not exist.");
          res.status(400).send("User does not exist.");

          return;
        }

        await notification
          .findOneAndDelete({ user: { $eq: req.body.user } })
          .exec()
          .then((): void => {
            debug.log("Deleted notification entry.");
          });

        await messages
          .deleteMany({ user: { $eq: req.body.user } })
          .exec()
          .then(async (): Promise<void> => {
            await userSchema
              .findOneAndDelete({ id: user.id })
              .exec()
              .then((): void => {
                res.status(200).send("User deleted.");
                debug.log(`${user.username} was deleted.`);
              });
          });
      });
  } catch (err: unknown) {
    res.status(500).send(err);

    debug.error(err);
  }
};

export default deleteUser;

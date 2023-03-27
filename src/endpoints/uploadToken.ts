import { NextFunction, Request, Response } from "express";

import notification from "../schema/notificationSchema";
import debug from "../utils/debug";
import { NotificationSchemaType } from "../utils";

/**
 * This is the upload token endpoint, this endpoint will create or modify the token database entry.
 *
 * @experimental
 * @param {string} user The user reference of the new/old entry.
 * @param {string} token The new token of the notification entry.
 * @type {POST} The is a post typed endpoint.
 */

const uploadToken = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  if (req.query.key !== String(process.env.KEY)) {
    res.status(401).send("Invalid api key.");
    return;
  }
  try {
    await notification
      .findOne({ user: { $eq: req.body.user } })
      .exec()
      .then(
        async (notificationInstance: NotificationSchemaType): Promise<void> => {
          if (notificationInstance === null) {
            await new notification({
              user: req.body.user,
              token: req.body.token,
            })
              .save()
              .then((): void => {
                debug.log("Saved new notification entry.");
                res.status(201).send("Created new notification entry.");
              });
          } else {
            if (notificationInstance.token === req.body.token) {
              res.status(208).send("Token entry already uploaded.");
            } else {
              notification
                .findOneAndUpdate(
                  { user: req.body.user },
                  { token: req.body.token }
                )
                .exec()
                .then((): void => {
                  debug.log("Updated notification entry.");
                  res.status(200).send("Updated entry successfully.");
                });
            }
          }
        }
      );
  } catch (err: unknown) {
    res.status(500).send(`SERVER ERROR: ${err}`);
    debug.error(err);
  }
};

export default uploadToken;

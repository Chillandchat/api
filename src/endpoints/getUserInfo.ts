import { NextFunction, Request, Response } from "express";

import { AuthSchemaType } from "../utils";
import user from "../schema/authSchema";
import debug from "../utils/debug";

/**
 * This endpoint will return the user information from the server once called.
 *
 * @type {GET} This is a get typed endpoint.
 * @param {string} username The username of the user you want to search.
 * @returns {AuthSchemaType | string} Returns the user information or a error message.
 */

const getUserInfo = async (
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
      .findOne({ username: { $eq: req.query.user } })
      .exec()
      .then((data: AuthSchemaType | null | undefined): void => {
        if (data !== null || data !== undefined) {
          res.status(200).send(data);

          debug.log(`User ${req.query.user} information sent.`);
        } else {
          res.status(404).send("User not found");
        }
      });
  } catch (err: unknown) {
    res.status(500).send(err);

    debug.error(err);
  }
};

export default getUserInfo;

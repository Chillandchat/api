import { NextFunction, Request, Response } from "express";

import { AuthSchemaType } from "../utils";
import user from "../schema/authSchema";
import debug from "../utils/debug";

/**
 * This endpoint will return the user information from the server once called but with the user id.
 *
 * @type {GET} This is a get typed endpoint.
 * @param {string} user The user id of the user to search.
 * @returns {AuthSchemaType | string} Returns the user information or a error message.
 */

const getUserInfoWithId = async (
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
      .findOne({ id: { $eq: req.query.user } })
      .exec()
      .then((data: AuthSchemaType | null | undefined): void => {
        if (data !== null || data !== undefined) {
          res.status(200).send(data);

          debug.log(`User ${req.query.user} information sent.`);
        } else {
          res.status(400).send("User not found");
        }
      });
  } catch (err: unknown) {
    res.status(500).send(`${err}`);

    debug.error(err);
  }
};

export default getUserInfoWithId;

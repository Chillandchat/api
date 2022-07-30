import { NextFunction, Request, Response } from "express";

import { AuthSchemaType } from "../utils";
import debug from "../utils/debug";
import user from "../schema/authSchema";

/**
 * This is the get users endpoint, this endpoint will return all users once called.
 *
 * @deprecated
 * @type {GET} This is a get endpoint.
 * @returns {Array<AuthSchemaType>} Returns a array of users, see './type.d.ts' for details.
 */

const getUsers = async (
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
      .find()
      .exec()
      .then((data: Array<AuthSchemaType>): void => {
        res.status(200).send(data);

        debug.log("Found users");
      });
  } catch (err: unknown) {
    res.status(500).send(err);

    debug.error(err);
  }
};

export default getUsers;

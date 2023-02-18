import { NextFunction, Request, Response } from "express";

import debug from "../utils/debug";

/**
 * This is the verify client endpoint, this endpoint will verify the legitimacy of the client.
 *
 * @experimental
 * @type {GET} This is a get typed endpoint.
 * @param {string} key The API key that will be used to verify client.
 * @returns {string} The result in a string if the client is legit.
 */

const verifyClient = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (req.query.key === process.env.KEY) {
    res.status(200).send("Verified successfully");
    debug.log(`Verified: ${req.socket.remoteAddress}`);
  } else {
    res.status(400).send("Failed to verify client!");
  }
};

export default verifyClient;

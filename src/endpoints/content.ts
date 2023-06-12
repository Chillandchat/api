import { NextFunction, Request, Response } from "express";

import debug from "../utils/debug";
import sanitizeDirectory from "../utils/sanitizeDirectory";

/**
 * This is the content endpoint, this endpoint will send the content to the user once called.
 * This endpoint is used to send images, videos, and other files to the user.
 *
 * @compatible
 * @type {GET} The type of request to the endpoint is get.
 * @param {string} path The path of the file.
 */

const content = (req: Request, res: Response, _next: NextFunction): void => {
  try {
    sanitizeDirectory(req.url.slice(8))
      .then((cleanPath: any): void => {
        res.status(200).sendFile(cleanPath.fullPath, {
          root: `${__dirname}/../../user-content`,
        });
        debug.log(`Content: ${cleanPath.fullPath} sent.`);
      })
      .catch((err): Response => res.status(403).send(err.toString()));
  } catch (err: unknown) {
    res.status(500).send(err);
    debug.error(err);
  }
};

export default content;

import { NextFunction, Request, Response } from "express";
import fs from "fs";

import debug from "../utils/debug";

/**
 * This is the get content endpoint, this endpoint will fetch and send the file to the client.
 *
 * @type {GET} This endpoint is a GET typed endpoint.
 * @param {string} id The id of the content from the database.
 * @param {string} user The user who sent the file.
 */

const getContent = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  const path: string = `${__dirname}/../../user-content/${req.query.user}/${req.query.id}.`;
  let data: Buffer;

  if (req.query.key !== String(process.env.KEY)) {
    res.status(401).send("Invalid api key.");
    return;
  }

  try {
    if (fs.existsSync(`${path}gif`)) {
      data = fs.readFileSync(`${path}gif`);
      debug.log(`Sent ${req.query.id}.gif`);
    } else if (fs.existsSync(`${path}webp`)) {
      data = fs.readFileSync(`${path}webp`);
      debug.log(`Sent ${req.query.id}.webp`);
    } else {
      res
        .status(400)
        .send(`${req.query.id} was not found in ${req.query.user}'s folder.`);
    }

    res.status(200).send(data);
  } catch (err: unknown) {
    res.status(500).send(`SERVER ERROR: ${err}`);
    debug.error(err);
  }
};

export default getContent;

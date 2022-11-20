import { NextFunction, Request, Response } from "express";
import fs from "fs";

import content from "../schema/contentSchema";
import debug from "../utils/debug";

/**
 * This is the upload content endpoint, this endpoint will save the content in the server.
 *
 * @experimental
 *
 * @type {POST} This is a POST typed endpoint.
 * @param {string} id The id of the content.
 * @param {string} content The content of the file.
 * @param {ContentType} type The type of the file.
 * @param {string} user The user who uploaded this content.
 */

const uploadContent = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  if (req.query.key !== String(process.env.KEY)) {
    res.status(401).send("Invalid api key.");
    return;
  }

  try {
    // 16000000 bits = 2MB
    // 8000000 bits = 1MB
    // 1 base-64 char = 6 bits

    if (req.body.type.length * 6 > 16000000)
      res.status(400).send("Upload cannot be larger than 2MB!");

    fs.writeFileSync(
      `../../user-content/${req.body.user}/${req.body.id}.${
        req.body.type === "CHILL&CHAT_GIF" ? "gif" : "img"
      }`,
      req.body.content,
      "base64"
    );

    await new content({
      id: req.body.id,
      type: req.body.type,
      url: ` ${req.protocol}://${req.get("host")}/get-content?user=${
        req.body.user
      }&id=${req.body.id}`,
      user: req.body.user,
    })
      .exec()
      .then((): void => {
        res.status(201).send("Image saved.");
        debug.log("New image saved.");
      });
  } catch (err: unknown) {
    res.status(500).send(`SERVER ERROR: ${err}`);
    debug.error(err);
  }
};

export default uploadContent;

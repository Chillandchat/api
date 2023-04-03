import { NextFunction, Request, Response } from "express";
import fs from "fs";
import sharp from "sharp";
import { exec } from "child_process";
import { FileTypeResult, fromBuffer } from "file-type";

import debug from "../utils/debug";
import user from "../schema/authSchema";
import { AuthSchemaType } from "../utils";

/**
 * This is the upload content endpoint, this endpoint will save the content in the server.
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
    await user
      .findOne({ username: { $eq: req.body.user } })
      .exec()
      .then(async (user: AuthSchemaType): Promise<void> => {
        if (user === null) {
          res.status(400).send("ERROR: Non-existent user!");
          return;
        } else {
          const videoFormat: FileTypeResult | null | undefined =
            req.body.type === "CHILL&CHAT_GIF"
              ? await fromBuffer(Buffer.from(req.body.content, "base64"))
              : null;

          const fileType: string =
            videoFormat !== null ? videoFormat.ext : "webp";
          if (
            !fs.existsSync(`${__dirname}/../../user-content/${req.body.user}`)
          )
            fs.mkdirSync(`${__dirname}/../../user-content/${req.body.user}`, {
              recursive: true,
            });

          fs.writeFileSync(
            `${__dirname}/../../user-content/${req.body.user}/${req.body.id}.${fileType}`,
            req.body.type === "CHILL&CHAT_GIF"
              ? Buffer.from(req.body.content, "base64")
              : await sharp(Buffer.from(req.body.content, "base64"))
                  .webp({ lossless: true })
                  .toBuffer(),
            "base64"
          );

          if (req.body.type === "CHILL&CHAT_GIF") {
            const uuid4Regex: RegExp =
              /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89aAbB][0-9a-f]{3}-[0-9a-f]{12}$/i;

            if (!uuid4Regex.test(req.body.id) || req.body.user.includes(" ")) {
              res
                .status(400)
                .send("ERROR: Invalid input format, please correct format.");
              return;
            }

            const command: string = `ffmpeg -ss 00:00:00.000 -i ${__dirname}/../../user-content/${req.body.user}/${req.body.id}.${fileType} -pix_fmt rgb24  -s 320x240 -r 10 -t 00:00:10.000 ${__dirname}/../../user-content/${req.body.user}/${req.body.id}.gif`;
            exec(command);
          }
        }
      });
  } catch (err: unknown) {
    res.status(500).send(`SERVER ERROR: ${err}`);
    debug.error(err);
  }
};

export default uploadContent;

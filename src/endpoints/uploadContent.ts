import sharp from "sharp";
import { exec } from "child_process";
import { NextFunction, Request, Response } from "express";
import fs from "fs";
import convert from "heic-convert";

import user from "../schema/authSchema";
import { AuthSchemaType } from "../utils";
import debug from "../utils/debug";
import sanitizeDirectory from "../utils/sanitizeDirectory";

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
    if (req.query.useBinaryUploadEndpoint !== "true") {
      res.redirect(300, "/legacy-endpoints/upload-content");
      return;
    }

    await user
      .findOne({ username: { $eq: req.query.user } })
      .exec()
      .then(async (user: AuthSchemaType): Promise<void> => {
        if (user === null) {
          res.status(400).send("ERROR: Non-existent user!");
          return;
        }

        if (!fs.existsSync(`${__dirname}/../../user-content/${req.body.user}`))
          fs.mkdirSync(`${__dirname}/../../user-content/${req.body.user}`, {
            recursive: true,
          });

        let path: any;
        const fileExtension: string =
          req.query.type === "CHILL&CHAT_IMG" ? "webp" : "gif";

        await sanitizeDirectory(
          `${req.query.user}/${req.query.id}.${fileExtension}`
        )
          .then((cleanPath: any): void => (path = cleanPath.fullPath))
          .catch((err): Response => res.status(403).send(err));

        if (path === undefined) return;

        if (fs.existsSync(`${__dirname}/../../user-content/${path}`)) {
          res.status(400).send("ERROR: File already exists!");
          return;
        }

        if (req.headers["Content-Type"] !== "application/octet-stream") {
          res.status(400).send("ERROR: Invalid content type.");
          return;
        }

        switch (req.query.type) {
          case "CHILL&CHAT_IMG":
            const heic: boolean = req.body
              .slice(0, 16)
              .toString("utf-8")
              .includes("heic");

            const buffer: any = !heic
              ? req.body
              : await convert({
                  buffer: req.body,
                  format: "JPEG",
                  quality: 1,
                });

            fs.writeFileSync(
              `${__dirname}/../../user-content/${path}`,
              await sharp(buffer).webp({ lossless: true }).toBuffer()
            );
            break;

          case "CHILL&CHAT_GIF":
            fs.writeFileSync(
              `${__dirname}/../../user-content/${path.slice(path.length - 4)}`,
              req.body
            );

            const command: string = `ffmpeg -i ${__dirname}/../../user-content/${path.slice(
              path.length - 4
            )} -pix_fmt rgb8 ${__dirname}/../../user-content/${path}`;
            exec(command, (_err: unknown): void => {
              fs.unlinkSync(
                `${__dirname}/../../user-content/${path.slice(path.length - 4)}`
              );
            });
            break;

          default:
            res
              .status(400)
              .send(
                "ERROR: Invalid file type, please provide correct file type."
              );
            return;
        }

        res.status(201).send("Successfully saved file.");
        debug.log(`Successfully saved upload item: /user-content/${path}`);
      });
  } catch (err: unknown) {
    res.status(500).send(`SERVER ERROR: ${err}`);
    debug.error(err);
  }
};

export default uploadContent;

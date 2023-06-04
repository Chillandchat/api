import sharp from "sharp";
import { exec } from "child_process";
import { NextFunction, Request, Response } from "express";
import fs from "fs";

import user from "../schema/authSchema";
import { AuthSchemaType } from "../utils";
import debug from "../utils/debug";

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

        const uuid4Regex: RegExp =
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89aAbB][0-9a-f]{3}-[0-9a-f]{12}$/i;

        if (
          !uuid4Regex.test(req.query.id.toString()) ||
          req.query.user.toString().includes(" ")
        ) {
          res
            .status(400)
            .send("ERROR: Invalid input format, please correct format.");
          return;
        }

        switch (req.query.type) {
          case "CHILL&CHAT_IMG":
            fs.writeFileSync(
              `${__dirname}/../../user-content/${req.query.user}/${req.query.id}.webp`,
              await sharp(req.body).webp({ lossless: true }).toBuffer()
            );
            break;

          case "CHILL&CHAT_GIF":
            fs.writeFileSync(
              `${__dirname}/../../user-content/${req.query.user}/${req.query.id}.mp4`,
              req.body
            );

            const command: string = `ffmpeg -i ${__dirname}/../../user-content/${req.query.user}/${req.query.id}.mp4 -pix_fmt rgb8 ${__dirname}/../../user-content/${req.query.user}/${req.query.id}.gif`;
            exec(command, (_err: unknown): void => {
              fs.unlinkSync(
                `${__dirname}/../../user-content/${req.query.user}/${req.query.id}.mp4`
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
        debug.log(
          `Successfully saved upload item: /user-content/${req.query.user}/${
            req.query.id
          }.${req.body.query === "CHILL&CHAT_IMG" ? "webp" : "mp4"}`
        );
      });
  } catch (err: unknown) {
    res.status(500).send(`SERVER ERROR: ${err}`);
    debug.error(err);
  }
};

export default uploadContent;

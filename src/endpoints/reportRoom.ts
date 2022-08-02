import { NextFunction, Request, Response } from "express";
import nodemailer from "nodemailer";

import debug from "../utils/debug";

/**
 * This endpoint will report a user via email once called.
 *
 * @type {POST} This is a post typed endpoint.
 * @param {string} room The room that will be reported.
 * @returns {string} Returns the result in a string format.
 */

const reportRoom = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  if (req.query.key !== String(process.env.KEY)) {
    res.status(401).send("ERROR: Invalid api key.");
    return;
  }

  const transporter: any = nodemailer.createTransport({
    service: "outlook",
    auth: {
      user: process.env.API_EMAIL,
      pass: process.env.API_EMAIL_PASS,
    },
  });

  const mailOptions: any = {
    from: process.env.API_EMAIL,
    to: process.env.API_EMAIL,
    subject: "Chill&chat server report ticket",
    html: `<p>Room: '${req.body.room}' has been <strong>reported</strong>. Please check the mongoDB database by click <a href="https://cloud.mongodb.com/v2/616bf442b46d030b8167cc0d#clusters">here</a>. Or check the heroku API logs by clicking <a href="https://dashboard.heroku.com/apps/chillandchat-api/logs">here</a>.</p>`,
    secureConnection: true,
  };

  await transporter.sendMail(
    mailOptions,
    (err: any, _data: any, _next: any): void => {
      if (err === null) {
        res.status(200).send("Report sent.");
        debug.log(`Report sent.`);
      } else {
        res.status(500).send(`Error: ${err}`);
      }
    }
  );
};

export default reportRoom;

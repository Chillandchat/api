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

  let emailOk: boolean = false;
  let error: string;

  const transporter: any = nodemailer.createTransport({
    service: "icloud",
    auth: {
      user: process.env.API_EMAIL,
      pass: process.env.API_EMAIL_PASS,
    },
  });

  const mailOptions: any = {
    from: process.env.API_EMAIL,
    to: "alvincheng88@icloud.com",
    subject: "You have a new report from the Chill&chat server",
    text: `${req.body.room} has got reported and please check mongoDB logs now.`,
  };

  await transporter.sendMail(
    mailOptions,
    (err: any, _data: any, _next: any): void => {
      if (err) {
        error = err;
        emailOk = false;
      } else emailOk = true;
    }
  );
  if (emailOk) {
    res.status(200).send();
    debug.log(`Room ${req.body.room} reported.`);
  } else res.status(500).send(`SERVER ERROR: ${error}`);
};

export default reportRoom;

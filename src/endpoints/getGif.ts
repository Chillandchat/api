import { NextFunction, Request, Response } from "express";
import fetch from "node-fetch";

import debug from "../utils/debug";

/**
 * This is the get gif endpoint, this endpoint will return the gif images from a search term,
 * or trending is search parameter is not provided.
 *
 * @param {string} search The search term.
 * @returns {Array<unknown>} Returns the gif images in an array format.
 * @see https://developers.giphy.com/docs/api/schema#gif-object for schema definition.
 */

const getGif = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  if (req.query.key !== String(process.env.KEY)) {
    res.status(401).send("Invalid api key.");
    return;
  }

  try {
    fetch(
      req.query.search === undefined
        ? `https://api.giphy.com/v1/gifs/trending?api_key=${process.env.GIPHY_KEY}&limit=30&rating=g`
        : `https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_KEY}&q=${req.query.search}hi&limit=30&offset=0&rating=g&lang=en`
    ).then((data: any): void => {
      data.json().then((json: any): void => {
        res.status(200).send(json.data);
      });

      debug.log(
        `Found ${
          req.query.search === undefined ? "trending" : req.query.search
        } GIFs`
      );
    });
  } catch (err: unknown) {
    res.status(500).send(err);

    debug.error(err);
  }
};

export default getGif;

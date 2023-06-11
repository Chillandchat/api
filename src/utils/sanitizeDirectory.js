"use strict";

// @ts-check
// TODO: Add JSDoc and Typescript

import sanitize from "sanitize-filename";

async function sanitizeDirectory(inputDirectory) {
  const regex = /^(.*\/)?(.+)\.(\w+)$/;
  let [fullPath, directory, fileName, extension] = regex.exec(inputDirectory);

  fileName = sanitize(fileName);

  if (directory.includes(/\/?\.\.\//g.source))
    throw new Error(`File path: ${directory} is not allowed.`);

  if (extension !== "webp" && extension !== "gif")
    throw new Error(`File extension: ${extension} is not allowed.`);

  fullPath = `${directory}${fileName}.${extension}`;

  return { fullPath, directory, fileName, extension };
}

export default sanitizeDirectory;

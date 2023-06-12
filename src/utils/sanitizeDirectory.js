"use strict";

// @ts-check
// TODO: Add JSDoc and Typescript

import sanitize from "sanitize-filename";

async function sanitizeDirectory(inputDirectory) {
  const PARSER_REGEX = /^(.*\/)?([\w-]+)\.(\w+)$/;

  if (inputDirectory.includes("/../"))
    throw new Error(`File path: ${inputDirectory} is not allowed.`);

  let [fullPath, directory, fileName, extension] =
    PARSER_REGEX.exec(inputDirectory);

  fileName = sanitize(fileName);

  if (extension !== "webp" && extension !== "gif")
    throw new Error(`File extension: ${extension} is not allowed.`);

  fullPath = `${directory}${fileName}.${extension}`;

  return { fullPath, directory, fileName, extension };
}

export default sanitizeDirectory;

/**
 * This is the not found page for the CHill&chat API, this endpoint will send an
 * error message to the client-side user, to inform no fetched page was found.
 *
 * @type {GET} This is a get typed endpoint.
 * @note No parameters are required.
 */

const notFound = (_req: any, res: any, _next: any): void => {
  res
    .status(404)
    .send(
      "REQUEST ERROR: The page you requested was not found, please type a valid URL."
    );
};

export default notFound;

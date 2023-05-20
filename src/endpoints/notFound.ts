/**
 * This function is the middleware used to handle the 404 error.
 *
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

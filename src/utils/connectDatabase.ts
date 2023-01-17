import mongoose from "mongoose";

import debug from "./debug";

/**
 * This is the connectDatabase function, this function will connect the server to the mongoDB database via mongoose.
 * This function uses the await keyword in order to wait for the connection to be finished
 * due to the asynchronous nature of mongoose.connect().
 *
 * @note There are no arguments in this function, you must have the DATABASE_URL set in the .env.
 */

const connectDatabase = async (): Promise<void> => {
  mongoose.set("strictQuery", true);
  await mongoose
    .connect(String(process.env.DATABASE_URI))
    .catch((err: unknown): void => {
      debug.error(err);
      process.exit(1);
    });
};

export default connectDatabase;

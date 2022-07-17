import debug from "./debug";

/**
 * This is the up time function, this function insures that the server is running at all times.
 * Due to the heroku server SIGTERM signal, which turns off the server every 30 minutes. This function will enable 100% up-time
 * 
 * @note This function has no arguments
 */

const upTime = (): void => {
  setTimeout(() => {
    debug.log("Heroku up time reset.");
    upTime();
  }, 60000 * 30);
};

export default upTime;

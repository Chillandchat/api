import debug from "./debug";

const upTime = (): void => {
  setTimeout(() => {
    debug.log("Heroku up time reset.");
    upTime();
  }, 60000 * 30);
};

export default upTime;

import debug from "./debug";

const upTime = (): void => {
  setTimeout(() => {
    debug.log("Heroku up time reset.");
    upTime();
  }, 10);
};

export default upTime;

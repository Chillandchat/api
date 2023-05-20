import https from "https";
import http from "http";

process.env.NODE_ENV == "production"
  ? (http.globalAgent.maxSockets = Infinity)
  : null;

process.env.NODE_ENV == "production"
  ? (https.globalAgent.maxSockets = Infinity)
  : null;

import https from "https";
import http from "http";

http.globalAgent.maxSockets = Infinity;
https.globalAgent.maxSockets = Infinity;

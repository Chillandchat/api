/**
 * Welcome to the...
 *   ____ _     _ _ _  ___        _           _
 *  / ___| |__ (_) | |( _ )   ___| |__   __ _| |_
 * | |   | '_ \| | | |/ _ \/\/ __| '_ \ / _` | __|
 * | |___| | | | | | | (_>  < (__| | | | (_| | |_
 *  \____|_| |_|_|_|_|\___/\/\___|_| |_|\__,_|\__|  API
 *
 * codebase!
 *
 * This is the codebase guide for developers viewing this codebase.
 *
 * We have organized the codebase into the following folders:
 * Source:
 *    - static: This is where the static files are stored.
 *    - utils: This is where the utility functions/types are stored.
 *    - schema: This is where the database schema is stored.
 *    - endpoints: This is where the endpoints are stored.
 *
 * Tech stack:
 *    - TypeScript: This is the main language used in the application.
 *    - Express: This is the framework used to create the API.
 *    - MongoDB: This is the database used to store the data.
 *    - Mongoose: This is the framework used to interact with the database.
 *    - Socket.io: This is the framework used to create the realtime API.
 *
 * Happy hacking!
 */

import { Server, Socket } from "socket.io";
import { createServer } from "http";
import express from "express";
import dotenv from "dotenv";
import compression from "compression";
import NodeCache from "node-cache";

import contentEndpoint from "./endpoints/content";
import home from "./endpoints/home";
import getMessages from "./endpoints/getMessages";
import signup from "./endpoints/signup";
import getUsers from "./endpoints/getUsers";
import login from "./endpoints/login";
import getUserInfo from "./endpoints/getUserInfo";
import blockUser from "./endpoints/blockUser";
import getAllRooms from "./endpoints/getAllRooms";
import createRoom from "./endpoints/createRoom";
import siteMap from "./endpoints/sitemap";
import rateLimit from "express-rate-limit";
import joinRoom from "./endpoints/joinRoom";
import searchMessage from "./endpoints/SearchMessage";
import debug from "./utils/debug";
import reportRoom from "./endpoints/reportRoom";
import removeRoom from "./endpoints/removeRoom";
import unfollowUser from "./endpoints/unfollowuser";
import followUser from "./endpoints/followUser";
import updateDescription from "./endpoints/updateDescription";
import updateIconColor from "./endpoints/updateIconColor";
import getPublicRooms from "./endpoints/getPublicRooms";
import legacyUploadContent from "./endpoints/legacyUploadContent";
import content from "./schema/contentSchema";
import connectDatabase from "./utils/connectDatabase";
import getGif from "./endpoints/getGif";
import deleteUser from "./endpoints/deleteUser";
import verifyClient from "./endpoints/verifyClient";
import sendNotifications from "./utils/sendNotification";
import uploadToken from "./endpoints/uploadToken";
import uploadContent from "./endpoints/uploadContent";
import deleteMessage from "./sockets/deleteMessage";
import keyboard from "./sockets/keyboard";
import notFound from "./endpoints/notFound";

const app: express.Express = express();
const httpServer: any = createServer(app);
export const io = new Server(httpServer);

dotenv.config();
debug.init();
connectDatabase();

app.use(compression());
app.use(express.json({ limit: "10mb" }));

app.use(
  rateLimit({
    windowMs: 1 * 30 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/", home);
app.get("/site-map", siteMap);

app.post("/api/login", login);
app.get("/api/get-messages", getMessages);
app.get("/api/get-user-info", getUserInfo);
app.get("/api/get-rooms", getAllRooms);
app.get("/api/verify-client", verifyClient);
app.get("/api/get-gif", getGif);
app.get("/api/get-public-rooms", getPublicRooms);
app.get("/content*/", contentEndpoint);

app.post("/api/delete-user", deleteUser);
app.post("/api/search-message", searchMessage);
app.post("/api/block_user", blockUser);
app.post("/api/create-room", createRoom);
app.post("/api/join-room", joinRoom);
app.post("/api/report-room", reportRoom);
app.post("/api/remove-room", removeRoom);
app.post("/api/unfollow-user", unfollowUser);
app.post("/api/signup", signup);
app.post("/api/follow-user", followUser);
app.post("/api/update-description", updateDescription);
app.post("/api/update-icon-color", updateIconColor);
app.post("/api/upload-token", uploadToken);
app.post("/api/upload-content", express.raw({ limit: "100mb" }), uploadContent);

/** ---------------------- @deprecated ---------------------- */
app.get("/legacy-endpoints/get-users", getUsers);
app.post("/legacy-endpoints/upload-content", legacyUploadContent);

io.on("connection", (socket: Socket): void => {
  socket.on("server-message", sendNotifications);
  socket.on("server-keyboard", keyboard);
  socket.on("server-message-delete", deleteMessage);
});

app.use(notFound);

const PORT: number = Number(process.env.PORT) || 3000;

httpServer.listen(PORT, (): void => {
  debug.log(`Server listening on port ${PORT}`);
});

// pre-alpha dev version 0.0.1
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import router from "./src/router.js";
import fileUpload from "express-fileupload";
import { createServer } from "http";
import { Server } from "socket.io";
import "dotenv/config";

import jwt from "jsonwebtoken";
import { secret } from "./src/config.js";
import UserService from "./src/services/UserService.js";

// constants
const PORT = 5003;
const DB_URL = process.env.DB_CONNECT;
const app = express();

// creating socket.io server and passing express server to it
const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: { origin: "https://artvibe.space" },
});

app.use(cors());
app.use(express.json());
app.use(express.static("static"));
app.use(fileUpload({}));
app.use("/api", router);

let usersCount = 0;

// socket.io connection
io.on("connection", (socket) => {
  if (socket.handshake.auth.token) {
    usersCount++;
    const token = jwt.verify(socket.handshake.auth.token, secret);

    UserService.toggleOnlineStatus(token.id, true);
    console.log(token.username, "connected");

    io.emit("onlineUsers", usersCount);

    socket.on("disconnect", () => {
      usersCount--;
      UserService.toggleOnlineStatus(token.id, false);
      console.log(token.username, "disconnected");
      io.emit("onlineUsers", usersCount);
    });
  } else {
    console.log("Guest connected");

    socket.on("disconnect", () => {
      console.log("Guest disconnected");
    });
  }
});

// starting server
async function startApp() {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

startApp();

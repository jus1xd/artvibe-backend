// pre-alpha dev version 0.0.1
import express from "express";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import router from "./src/router.js";
import fileUpload from "express-fileupload";
import { createServer } from "http";
import { Server } from "socket.io";
import UserController from "./src/controllers/UserController.js";

// constants
const PORT = 5003;
const DB_URL =
  "mongodb+srv://jus1xd:admin@artvibee.y27vzqr.mongodb.net/?retryWrites=true&w=majority";

const app = express();

// creating socket.io server and passing express server to it
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: { origin: "http://localhost:3000" },
});

app.use(cors());
app.use(express.json());
app.use(express.static("static"));
app.use(fileUpload({}));
app.use("/api", router);

// socket.io connection
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
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

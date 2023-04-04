// pre-alpha dev version 0.0.1
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import router from "./src/router.js";
import fileUpload from "express-fileupload";
import * as path from "path";

const allowedOrigins = [
  "https://artvibe.onrender.com",
  "https://artvibeapi.onrender.com",
  "http://localhost:3000",
  "http://localhost:5003",
];

const __dirname = path.resolve();
const PORT = 5003;
const DB_URL =
  "mongodb+srv://jus1xd:admin@artvibee.y27vzqr.mongodb.net/?retryWrites=true&w=majority";

const app = express();

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) === -1) {
//         const msg =
//           "The CORS policy for this site does not allow access from the specified Origin.";
//         return callback(new Error(msg), false);
//       }
//       return callback(null, true);
//     },
//   })
// );
app.use(cors());
app.use(express.json());
app.use(express.static("static"));
app.use(fileUpload({}));
app.use("/api", router);

async function startApp() {
  try {
    await mongoose.connect(DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

startApp();

import mongoose, { version } from "mongoose";

const Dialog = new mongoose.Schema({
  messages: [
    {
      senderId: { type: String, required: true },
      text: { type: String, default: "" },
      pictures: { type: String, default: "" },
      date: { type: String, default: Date.now() },
    },
  ],
});

export default mongoose.model("Dialog", Dialog);

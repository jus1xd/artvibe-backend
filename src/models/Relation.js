import mongoose, { version } from "mongoose";

const Relation = new mongoose.Schema({
  userId: { type: String, required: true },
  friendId: { type: String, required: true },
  dialogId: { type: String, required: true },
  isFriends: { type: Boolean, default: false },
  requestAccepted: { type: Boolean, default: false },
  requestSent: { type: Boolean, default: false },
});

export default mongoose.model("Relation", Relation);

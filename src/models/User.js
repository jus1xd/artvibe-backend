import mongoose, { version } from "mongoose";

const User = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    city: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    pageCover: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "",
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastOnline: {
      type: String,
      default: Date.now(),
    },
    friends: [
      {
        _id: false,
        relationId: { type: String, required: true },
      },
    ],
    chats: [
      {
        chatId: { type: String, required: true },
      },
    ],
    posts: [
      {
        postId: { type: String, required: true },
      },
    ],
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  }
  // {
  //   versionKey: true,
  // }
);

export default mongoose.model("User", User);

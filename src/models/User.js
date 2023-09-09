import mongoose from "mongoose";

const User = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    default: "",
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
    default: "",
  },
  friends: [
    {
      idOfFriend: String,
      name: String,
      avatar: String,
      messages: [
        {
          text: String,
          pictures: { type: String, default: "" },
          date: String,
          senderId: String, // Идентификатор отправителя сообщения
          senderName: String, // Имя отправителя сообщения
          senderAvatar: String, // Аватар отправителя сообщения
        },
      ],
    },
  ],
  posts: [
    {
      text: { type: String, default: "" },
      pictures: { type: String, default: "" },
      authorId: { type: String, required: true },
      authorName: { type: String, required: true },
      authorAvatar: { type: String, default: "" },
      createdAt: { type: Date, default: Date.now },
      likes: [
        {
          userId: { type: String },
          userName: { type: String },
        },
      ],
      comments: [
        {
          text: { type: String, default: "" },
          pictures: { type: String, default: "" },
          userId: { type: String, required: true },
          userName: { type: String, required: true },
          userAvatar: { type: String, default: "" },
          createdAt: { type: Date, default: Date.now },
        },
      ],
    },
  ],
  avatar: {
    type: String,
    default: "",
  },
  pageCover: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: true,
  },
});

export default mongoose.model("User", User);

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
  friends: [
    {
      idOfFriend: String,
      name: String,
      avatar: String,
      messages: [
        {
          text: String,
          date: String,
          senderId: String, // Идентификатор отправителя сообщения
          senderName: String, // Имя отправителя сообщения
          senderAvatar: String, // Аватар отправителя сообщения
        },
      ],
    },
  ],
  avatar: {
    type: String,
    required: true,
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

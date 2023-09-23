import mongoose from "mongoose";

const Post = new mongoose.Schema({
  text: { type: String, default: "" },
  pictures: { type: String, default: "" },
  authorId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  likes: [
    {
      userId: { type: String, required: true },
    },
  ],
  comments: [
    {
      text: { type: String, default: "" },
      pictures: { type: String, default: "" },
      userId: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model("Post", Post);

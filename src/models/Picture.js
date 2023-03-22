import mongoose from "mongoose";

const Picture = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  type: {
    type: String,
  },
  year: {
    type: Number,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

export default mongoose.model("Picture", Picture);

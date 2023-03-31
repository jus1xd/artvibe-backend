import mongoose from "mongoose";

const Country = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true
  },
  authors: {
    type: Array,
    // required: true
  },
  pictures: {
    type: Array,
    // required: true
  }
});

export default mongoose.model("Country", Country);

import mongoose from "mongoose";

const Author = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  birthdate: {
    type: String,
    required: true,
  },
  deathdate: {
    type: String,
  },
  country: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  pictures: {
    type: Array,
  },
});

export default mongoose.model("Author", Author);

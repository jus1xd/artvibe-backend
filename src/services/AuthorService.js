import Author from "../models/Author.js";
import fileService from "./fileService.js";

class AuthorService {
  async create(author, image) {
    const fileName = fileService.saveFile(image);
    const createdAuthor = await Author.create(
      author
      // fileName
    );
    return createdAuthor;
  }

  async getAll() {
    const authors = await Author.find();
    return authors;
  }

  async getOne(id) {
    if (!id) {
      throw new Error("ID не указан");
    }
    const author = await Author.findById(id);
    return author;
  }

  async update(author) {
    if (!author._id) {
      throw new Error("ID не указан");
    }
    const updatedAuthor = await Author.findByIdAndUpdate(author._id, author, {
      new: true,
    });
    return updatedAuthor;
  }

  async delete(id) {
    if (!id) {
      throw new Error("ID не указан");
    }
    const author = await Author.findByIdAndDelete(id);
    return author;
  }
}

export default new AuthorService();

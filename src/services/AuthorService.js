import Author from "../models/Author.js";

class AuthorService {
  async create(author) {
    const createdAuthor = await Author.create(author);
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

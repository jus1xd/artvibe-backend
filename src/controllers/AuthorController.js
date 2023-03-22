import Author from "../models/Author.js";
import AuthorService from "../services/AuthorService.js";

class AuthorController {
  async create(req, res) {
    try {
      const author = await Author.create(
        req.body,
        // req.files.image
      );
      res.json(author);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getAll(req, res) {
    try {
      const authors = await Author.find();
      res.json(authors);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async getOne(req, res) {
    try {
      const author = await AuthorService.getOne(req.params.id);
      res.json(author);
    } catch (e) {
      res.status(500).json(e);
    }
  }

  async update(req, res) {
    try {
      const updatedAuthor = await AuthorService.update(req.body);
      res.json(updatedAuthor);
    } catch (e) {
      res.status(500).json(e.message);
    }
  }

  async delete(req, res) {
    try {
      const author = await Author.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Автор удален" });
    } catch (e) {
      res.status(500).json(e.message);
    }
  }
}

export default new AuthorController();

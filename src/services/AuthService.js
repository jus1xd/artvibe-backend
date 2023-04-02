import Author from "../models/Author.js";
import fileService from "./fileService.js";

class AuthService {
  // async update(author) {
  //   if (!author._id) {
  //     throw new Error("ID не указан");
  //   }
  //   const updatedAuthor = await Author.findByIdAndUpdate(author._id, author, {
  //     new: true,
  //   });
  //   return updatedAuthor;
  // }

  async delete(id) {
    if (!id) {
      throw new Error("ID не указан");
    }
    const user = await User.findByIdAndDelete(id);
    return user;
  }
}

export default new AuthService();

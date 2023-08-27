import User from "../models/User.js";
import fileService from "./fileService.js";

class PostService {
  async createPost(originId, text, pictures, authorId) {
    const originUser = await User.findById(originId);
    const authorUser = await User.findById(authorId);

    const postPictures = await fileService.saveFile(pictures);

    if (!originUser) {
      throw new Error("Origin user not found");
    }

    let newPost = {
      text: text,
      pictures: postPictures,
      authorId: authorId,
      authorName: authorUser.name,
      authorAvatar: authorUser.avatar,
      createdAt: Date.now(),
      likes: 0,
      comments: [],
    };

    originUser.posts.push(newPost);

    await originUser.save();

    return originUser.posts[originUser.posts.length - 1];
  }

  async deletePost(originId, postId, userId) {
    try {
      const user = await User.findById(originId);

      if (!user) {
        throw new Error("Пользователь не найден");
      }

      const postIndex = user.posts.findIndex(
        (post) => post._id.toString() === postId
      );

      if (postIndex === -1) {
        throw new Error("Пост не найден у пользователя");
      }

      // Проверка, является ли текущий пользователь автором поста
      if (user.posts[postIndex].authorId.toString() !== userId) {
        throw new Error("Текущий пользователь не является автором поста");
      }

      user.posts.splice(postIndex, 1);

      await user.save();

      return user;
    } catch (error) {
      throw new Error("Ошибка при удалении поста", error);
    }
  }

  // getAllPosts = async () => {
  //   return Post.find();
  // };

  // addComment = async (postId, text, authorId) => {
  //   const post = await Post.findById(postId);
  //   if (!post) {
  //     throw new Error("Post not found");
  //   }

  //   post.comments.push({ text, authorId });
  //   return post.save();
  // };
}

export default new PostService();

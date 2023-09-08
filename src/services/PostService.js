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
      likes: [],
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

  async likePost(originId, postId, userId) {
    try {
      const originUser = await User.findById(originId);
      const likeByUser = await User.findById(userId);

      if (!originUser) {
        throw new Error("Пользователь не найден");
      }

      const postIndex = originUser.posts.findIndex(
        (post) => post._id.toString() === postId
      );

      if (postIndex === -1) {
        throw new Error("Пост не найден у пользователя");
      }

      // Проверка, оценил ли текущий пользователь пост
      const likeIndex = originUser.posts[postIndex].likes.findIndex(
        (like) => like.userId.toString() === userId
      );

      if (likeIndex !== -1) {
        originUser.posts[postIndex].likes.splice(likeIndex, 1);
      } else {
        originUser.posts[postIndex].likes.push({
          userId: userId,
          userName: likeByUser.name,
        });
      }

      await originUser.save();
    } catch (error) {
      console.log(error);
      throw new Error("Ошибка при оценке поста", error);
    }
  }

  async addComment(originId, postId, userId, text, pictures) {
    try {
      const originUser = await User.findById(originId);
      const commentByUser = await User.findById(userId);

      const commentPictures = await fileService.saveFile(pictures);

      if (!originUser) {
        throw new Error("Пользователь не найден");
      }

      const postIndex = originUser.posts.findIndex(
        (post) => post._id.toString() === postId
      );

      if (postIndex === -1) {
        throw new Error("Пост не найден у пользователя");
      }

      originUser.posts[postIndex].comments.push({
        text,
        pictures: commentPictures,
        userId: commentByUser._id.toString(),
        userName: commentByUser.name,
        userAvatar: commentByUser.avatar,
        createdAt: Date.now(),
      });

      await originUser.save();

      return originUser.posts[postIndex].comments[
        originUser.posts[postIndex].comments.length - 1
      ];
    } catch (error) {
      console.log(error);
      throw new Error("Ошибка при оценке поста", error);
    }
  }
}

export default new PostService();

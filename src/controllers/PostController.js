import PostService from "../services/PostService.js";

class PostController {
  async createPost(req, res) {
    try {
      const { id, text, authorId } = req.body;
      const pictures = req.files ? req.files.pictures : null;

      const post = await PostService.createPost(id, text, pictures, authorId);
      res.status(201).json(post);
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Ошибка при создании поста" }, error);
    }
  }

  async deletePost(req, res) {
    const { originId, postId, userId } = req.body;

    try {
      const post = await PostService.deletePost(originId, postId, userId);

      return res.status(200).json({ message: "Пост успешно удален", post });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Произошла ошибка при удалении поста", error });
    }
  }

  async likePost(req, res) {
    const { originId, postId, userId } = req.body;

    try {
      const post = await PostService.likePost(originId, postId, userId);

      return res.status(200).json();
    } catch (error) {
      return res.status(500).json("Произошла ошибка при оценке поста");
    }
  }

  async addComment(req, res) {
    const { originId, postId, userId, text } = req.body;
    const pictures = req.files ? req.files.pictures : null;

    try {
      const comment = await PostService.addComment(
        originId,
        postId,
        userId,
        text,
        pictures
      );

      return res.status(200).json(comment);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Произошла ошибка при создания комментария", error });
    }
  }

  // getAllPosts = async (req, res) => {
  //   try {
  //     const posts = await Post.find();
  //     res.json(posts);
  //   } catch (error) {
  //     res.status(500).json({ error: "Could not fetch posts" });
  //   }
  // };

  // addComment = async (req, res) => {
  //   try {
  //     const { postId } = req.params;
  //     const { text, authorId } = req.body;

  //     const post = await PostService.addComment(postId, text, authorId);

  //     if (!post) {
  //       return res.status(404).json({ error: "Post not found" });
  //     }

  //     res.json(post);
  //   } catch (error) {
  //     res.status(500).json({ error: "Could not add comment" });
  //   }
  // };
}

export default new PostController();

import Router from "express";
import AuthController from "./controllers/AuthController.js";
import AuthorController from "./controllers/AuthorController.js";
import CountryController from "./controllers/CountryController.js";
import PictureController from "./controllers/PictureController.js";
import UserController from "./controllers/UserController.js";

import { roleMiddleware } from "./middleware/roleMiddleware.js";
import { check } from "express-validator";
import PostController from "./controllers/PostController.js";

const router = new Router();



// эндпоинты для авторов
router.post("/authors", AuthorController.create);
router.get("/authors", AuthorController.getAll);
router.get("/authors/:id", AuthorController.getOne);
router.put("/authors", AuthorController.update);
router.delete("/authors/:id", AuthorController.delete);

// эндпоинты для картин
router.post("/pictures", PictureController.create);
router.get("/pictures", PictureController.getAll);
router.get("/pictures/:id", PictureController.getOne);
router.put("/pictures", PictureController.update);
router.delete("/pictures/:id", PictureController.delete);

// эндпоинты для стран
router.post("/countries", CountryController.create);
router.get("/countries", CountryController.getAll);
router.get("/countries/:id", CountryController.getOne);
router.put("/countries", CountryController.update);
router.delete("/countries/:id", CountryController.delete);

// эндпоинты для пользователей
router.get("/peoples", UserController.getAllPeoples);
router.post("/friends", UserController.getFriends);
router.get("/user/:id", UserController.getUserById);
router.post("/user-cover", UserController.updateUserCover);
router.post("/add-friend", UserController.addFriend);
router.delete("/remove-friend", UserController.removeFriend);
// тут эндопоинты для сообщений
router.post("/conversation", UserController.getMessagesWithSenderInfo);
router.post("/send-message", UserController.sendMessage);
// тут эндопоинты для постов
router.post("/create-post", PostController.createPost);
router.delete("/delete-post", PostController.deletePost);
router.post("/like-post", PostController.likePost);
router.post("/comment-post", PostController.addComment);

// эндпоинты для авторизации и регистрации
router.post(
  "/registration",
  [
    check("name", "Имя не может быть пустым").notEmpty(),
    check("email", "Введите корректную почту").isEmail(),
    check("username", "Имя пользователя не может быть пустым").notEmpty(),
    check(
      "password",
      "Пароль должен быть больше 4 и меньше 12 символов"
    ).isLength({
      min: 4,
      max: 12,
    }),
  ],
  AuthController.registration
);

router.post(
  "/login",
  [
    check("email", "Введите корректную почту").isEmail(),
    check("password", "Пароль не может быть пустым").notEmpty(),
  ],
  AuthController.login
);

router.get("/users", roleMiddleware("admin"), AuthController.getAll);
router.delete("/users/:id", AuthController.delete);

export default router;

import User from "../models/User.js";
import UserService from "../services/UserService.js";

import { io } from "../../index.js";
import fileService from "../services/fileService.js";

class UserController {
  async addFriend(req, res) {
    try {
      const { userId, friendId } = req.body;
      const updatedUsers = await UserService.addFriend(userId, friendId);
      io.emit("friendAdded", updatedUsers); // Отправить сообщение всем подключенным клиентам
      res.json(updatedUsers);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async removeFriend(req, res) {
    try {
      const { userId, friendId } = req.body;
      const updatedUsers = await UserService.removeFriend(userId, friendId);
      io.emit("friendRemoved", updatedUsers); // Отправить сообщение всем подключенным клиентам
      res.json(updatedUsers);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getFriends(req, res) {
    try {
      const { userId } = req.body;
      const friends = await UserService.getFriends(userId);
      res.json(friends);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async getAllPeoples(req, res) {
    try {
      const peoples = await UserService.getAllPeoples();
      res.json(peoples);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async updateUserCover(req, res) {
    const userId = req.body.id;

    try {
      const pageCover = await fileService.saveFile(req.files.pageCover); // Предполагаем метод загрузки файла в FileService

      const updatedUser = await UserService.updateUserCover(userId, pageCover);

      if (!updatedUser) {
        return res.status(404).json({ message: "Пользователь не найден11" });
      }

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Произошла ошибка при обновлении данных пользователя",
      });
    }
  }

  async getUserById(req, res) {
    const userId = req.params.id;

    try {
      const user = await UserService.getUserById(userId);

      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      // Исключаем поля с паролем и почтой
      const { password, email, ...userWithoutSensitiveInfo } = user.toObject();

      return res.status(200).json(userWithoutSensitiveInfo);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Произошла ошибка при получении пользователя" });
    }
  }

  async getMessagesWithSenderInfo(req, res) {
    try {
      const { id, friendId } = req.body; // Получаем userId и friendId из тела запроса
      const messagesWithSenderInfo =
        await UserService.getMessagesWithSenderInfo(id, friendId);
      res.json(messagesWithSenderInfo);
    } catch (error) {
      res.status(500).json(error.message);
    }
  }

  async sendMessage(req, res) {
    try {
      const { clientId, friendId, messageText } = req.body;
      const pictures = await fileService.saveFile(
        req.files ? req.files.pictures : ""
      );

      const message = await UserService.sendMessage(
        clientId,
        friendId,
        messageText,
        pictures
      );

      io.emit("sendMessage", message); // Отправить сообщение всем подключенным клиентам

      res.status(200).json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new UserController();

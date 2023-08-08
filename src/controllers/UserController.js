import User from "../models/User.js";
import UserService from "../services/UserService.js";

import { io } from "../../index.js";

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
      const users = await User.find();
      res.json(users);
    } catch (e) {}
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
      const { id } = req.params;
      const { friendId, messageText } = req.body;
      const message = await UserService.sendMessage(id, friendId, messageText);

      io.emit("sendMessage", message); // Отправить сообщение всем подключенным клиентам

      res.status(200).json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new UserController();

import mongoose from "mongoose";
import User from "../models/User.js"; // Подставьте путь к вашей модели пользователя
import { io } from "../../index.js";
import Dialog from "../models/Dialog.js";
import Relation from "../models/Relation.js";

// Функция для добавления друга к пользователю по их ID
class UserService {
  async addFriend(userId, friendId) {
    try {
      const currentUser = await User.findById(userId);
      const friendUser = await User.findById(friendId);

      if (!currentUser || !friendUser) {
        throw new Error("Пользователь не найден");
      }

      // ищем связь с другом
      const relation = Relation.findOne({
        userId: currentUser._id.toString(),
        friendId: friendUser._id.toString(),
      });

      // если уже в друзьях
      if (relation.isFriends) {
        throw new Error("Пользователь уже в списке друзей");
      }

      // если не были в друзьях
      if (!relation._id) {
        const newDialog = new Dialog({
          messages: [],
        });

        const newRelation = new Relation({
          userId: currentUser._id.toString(),
          friendId: friendUser._id.toString(),
          dialogId: newDialog._id.toString(),
          isFriends: true,
          requestAccepted: false,
          requestSent: true,
        });

        currentUser.friends.push({
          relationId: newRelation._id.toString(),
        });

        friendUser.friends.push({
          relationId: newRelation._id.toString(),
        });

        await newDialog.save();
        await newRelation.save();
      } else {
        console.log("tut", relation._id);
        // если уже были в друзьях, то принимаем заявку
        relation.isFriends = true;
        relation.requestAccepted = true;
      }

      await currentUser.save();
      await friendUser.save();

      return {
        currentUser: currentUser,
        friendUser: friendUser,
      };
    } catch (error) {
      throw console.error(error);
    }
  }

  async removeFriend(userId, friendId) {
    try {
      const currentUser = await User.findById(userId);
      const friendUser = await User.findById(friendId);

      if (!currentUser || !friendUser) {
        throw new Error("Пользователь не найден");
      }

      // ищем связь с другом
      const relation = Relation.findOne({
        userId: currentUser._id.toString(),
        friendId: friendUser._id.toString(),
      });

      console.log("relation", relation.userId);

      if (!relation.isFriends) {
        throw new Error("Пользователь не в списке друзей");
      }

      relation.isFriends = false;

      await relation.save();
    } catch (error) {
      throw error;
    }
  }

  async getFriends(userId) {
    try {
      const currentUser = await User.findById(userId);

      if (!currentUser) {
        throw new Error("Пользователь не найден");
      }

      const relations = await Relation.find(
        currentUser.friends.relationId
      ).select("-_id userId friendId");

      return relations;
    } catch (error) {
      throw error;
    }
  }

  async getAllPeoples() {
    try {
      const allPeoples = await User.find().select(
        "_id fullname avatar isOnline"
      );
      return allPeoples;
    } catch (error) {
      throw error;
    }
  }

  async updateUserCover(userId, pageCover) {
    try {
      const currentUser = await User.findById(userId);

      console.log("userId on service", userId);

      if (!currentUser) {
        throw new Error("Пользователь не найден");
      }

      currentUser.pageCover = pageCover;
      await currentUser.save();
      return currentUser;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const currentUser = await User.findById(userId).select(
        "-password -email -friends.messages"
      ); // Исключаем поля с паролем и почтой
      return currentUser;
    } catch (error) {
      throw error;
    }
  }

  async getMessagesWithSenderInfo(id, friendId) {
    try {
      const currentUser = await User.findById(id);
      const friendUser = await User.findById(friendId);
      if (!currentUser) {
        throw new Error("Пользователь не найден");
      }

      console.log(currentUser.friends);

      const friendIndex = currentUser.friends.findIndex(
        (friend) => friend._id.toString() === friendId
      );
      if (friendIndex === -1) {
        throw new Error("Пользователь не является другом");
      }

      const messagesWithSenderInfo = currentUser.friends[
        friendIndex
      ].messages.map((message) => ({
        _id: message._id,
        text: message.text,
        date: message.date,
        friendId: friendId,
        friendName: friendUser.name, // Добавляем friendName
        friendAvatar: friendUser.avatar, // Добавляем friendAvatar
        senderId: message.senderId,
        senderName: message.senderName,
        senderAvatar: message.senderAvatar,
      }));

      return messagesWithSenderInfo;
    } catch (error) {
      throw error;
    }
  }

  async sendMessage(id, friendId, messageText, pictures) {
    try {
      const currentUser = await User.findById(id);
      const friendUser = await User.findById(friendId);

      if (!currentUser || !friendUser) {
        throw new Error("Пользователь не найден");
      }

      const currentUserFriendIndex = currentUser.friends.findIndex(
        (friend) => friend._id.toString() === friendId
      );
      const friendUserFriendIndex = friendUser.friends.findIndex(
        (friend) => friend._id.toString() === id
      );

      if (currentUserFriendIndex === -1 || friendUserFriendIndex === -1) {
        throw new Error("Пользователь не является другом");
      }

      const newMessage = {
        _id: new mongoose.Types.ObjectId(), // Генерируем новый _id
        text: messageText,
        pictures: pictures,
        date: new Date().toISOString(),
        friendId: friendId,
        friendName: friendUser.name, // Добавляем friendName
        friendAvatar: friendUser.avatar, // Добавляем friendAvatar
        senderId: id,
        senderName: currentUser.name, // Добавляем senderName
        senderAvatar: currentUser.avatar, // Добавляем senderAvatar
      };

      currentUser.friends[currentUserFriendIndex].messages.push(newMessage);
      friendUser.friends[friendUserFriendIndex].messages.push(newMessage);

      await currentUser.save();
      await friendUser.save();

      return newMessage;
    } catch (error) {
      throw error;
    }
  }

  async toggleOnlineStatus(userId, isOnline) {
    try {
      const currentUser = await User.findById(userId);

      if (!currentUser) {
        console.log("Пользователь не найден");
      }

      if (isOnline) {
        currentUser.isOnline = isOnline;
      } else {
        currentUser.isOnline = false;
        currentUser.lastOnline = new Date().toISOString();
      }

      await currentUser.save();
    } catch (error) {
      console.error(error);
    }
  }
}

export default new UserService();

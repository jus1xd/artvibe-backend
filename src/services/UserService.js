import mongoose from "mongoose";
import User from "../models/User.js"; // Подставьте путь к вашей модели пользователя

// Функция для добавления друга к пользователю по их ID
class UserService {
  async addFriend(userId, friendId) {
    try {
      const currentUser = await User.findById(userId);
      const friendUser = await User.findById(friendId);

      if (!currentUser || !friendUser) {
        throw new Error("Пользователь не найден");
      }

      const isAlreadyFriend = currentUser.friends.some(
        (friend) => friend._id.toString() === friendId
      );

      if (isAlreadyFriend) {
        throw new Error("Пользователь уже в списке друзей");
      }

      currentUser.friends.push({
        _id: friendUser._id.toString(),
        name: friendUser.name,
        avatar: friendUser.avatar,
        messages: [],
      });

      friendUser.friends.push({
        _id: currentUser._id.toString(),
        name: currentUser.name,
        avatar: currentUser.avatar,
        messages: [],
      });

      await currentUser.save();
      await friendUser.save();

      return {
        currentUser: currentUser,
        friendUser: friendUser,
      };
    } catch (error) {
      throw error;
    }
  }

  async removeFriend(userId, friendId) {
    try {
      const currentUser = await User.findById(userId);
      const friendUser = await User.findById(friendId);

      if (!currentUser || !friendUser) {
        throw new Error("Пользователь не найден");
      }

      const currentUserFriendIndex = currentUser.friends.findIndex(
        (friend) => friend._id.toString() === friendId
      );

      if (currentUserFriendIndex === -1) {
        throw new Error("Пользователь не является другом");
      }

      const friendUserFriendIndex = friendUser.friends.findIndex(
        (friend) => friend._id.toString() === userId
      );

      if (friendUserFriendIndex !== -1) {
        friendUser.friends.splice(friendUserFriendIndex, 1);
      }

      currentUser.friends.splice(currentUserFriendIndex, 1);

      await currentUser.save();
      await friendUser.save();

      return {
        currentUser: currentUser,
        friendUser: friendUser,
      };
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

      return currentUser.friends;
    } catch (error) {
      throw error;
    }
  }

  async getMessagesWithSenderInfo(id, friendId) {
    try {
      const currentUser = await User.findById(id);
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
        senderId: message.senderId,
        senderName: message.senderName,
        senderAvatar: message.senderAvatar,
      }));

      return messagesWithSenderInfo;
    } catch (error) {
      throw error;
    }
  }

  // async sendMessage(id, friendId, messageText) {
  //   try {
  //     const currentUser = await User.findById(id);
  //     const friendUser = await User.findById(friendId);

  //     if (!currentUser || !friendUser) {
  //       throw new Error("Пользователь не найден");
  //     }

  //     const currentUserFriendIndex = currentUser.friends.findIndex(
  //       (friend) => friend._id.toString() === friendId
  //     );
  //     const friendUserFriendIndex = friendUser.friends.findIndex(
  //       (friend) => friend._id.toString() === id
  //     );

  //     if (currentUserFriendIndex === -1 || friendUserFriendIndex === -1) {
  //       throw new Error("Пользователь не является другом");
  //     }

  //     const newMessage = {
  //       text: messageText,
  //       date: new Date().toISOString(),
  //       senderId: id,
  //     };

  //     currentUser.friends[currentUserFriendIndex].messages.push(newMessage);
  //     friendUser.friends[friendUserFriendIndex].messages.push(newMessage);

  //     await currentUser.save();
  //     await friendUser.save();

  //     return newMessage;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  async sendMessage(id, friendId, messageText) {
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
        date: new Date().toISOString(),
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
}

export default new UserService();

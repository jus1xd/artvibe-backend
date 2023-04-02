import User from "../models/User.js";
import AuthService from "../services/AuthService.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { secret } from "../config.js";

const generateAccessToken = (id, username, roles) => {
  const payload = {
    id,
    username,
    roles,
  };
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

class AuthController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Ошибка при регистрации", errors });
      }
      const { name, email, username, password } = req.body;
      const candidate = await User.findOne({ email });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "Пользователь с такой почтой уже существует" });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const user = new User({
        name,
        email,
        username,
        password: hashPassword,
        role: "user",
      });
      await user.save();
      const token = generateAccessToken(user._id, user.username, user.role);
      return res.json({ token });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Ошибка регистрации" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ message: `Почта не зарегистрирована` });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: "Неверный пароль" });
      }
      const token = generateAccessToken(user._id, user.username, user.role);
      return res.json({ token });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Ошибка авторизации" });
    }
  }

  async delete(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Пользователь удален" });
    } catch (e) {
      res.status(500).json(e.message);
    }
  }

  async getAll(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (e) {}
  }
}

export default new AuthController();

import jwt from "jsonwebtoken";
import { secret } from "../config.js";

export function roleMiddleware(role) {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }

    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(403).json({ message: "Пользователь не авторизован" });
      }
      const { roles: userRole } = jwt.verify(token, secret);
      let hasRole = false;
      userRole.includes(role) ? hasRole = true : false
      if (!hasRole) {
        return res.status(403).json({ message: "У вас нет доступа" });
      }
      next();
    } catch (e) {
      res.status(403).json({ message: "Пользователь не авторизован" });
    }
  };
}

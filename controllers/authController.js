const { User, Customer } = require("../models");
const { compare } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");

class AuthController {
  static async register(req, res, next) {
    try {
      const { username, email, password } = req.body;

      const user = await User.create({
        username: username,
        email: email,
        password: password,
      });

      const customer = await Customer.create({
        userId: user.dataValues.id,
      });

      const result = {
        userId: customer.userId,
        username: user.username,
        email: user.email,
      };

      res.status(201).json({ message: "Success create new user", result });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "Please provide email and password" });
      }

      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) throw { name: "LoginError" };

      if (!compare(password, user.password)) throw { name: "LoginError" };

      const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      };

      const accessToken = signToken(payload);

      res.status(200).json({
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;

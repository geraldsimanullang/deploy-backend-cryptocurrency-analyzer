const { User } = require("../models");
const { signToken } = require("../helpers/jwt");


class UserController {
  static async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      if (!password) {
        throw new Error("EmptyPassword");
      }

      const { hash } = require("../helpers/bcryptjs");
      const hashedPassword = hash(password);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      res.status(201).json({
        name: newUser.name,
        email: newUser.email,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new Error("InvalidLogin");
      }

      const user = await User.findOne({
        where: {
          email,
        },
      });

      const { compare } = require("../helpers/bcryptjs");
      if (!user || !compare(password, user.password)) {
        throw new Error("LoginError");
      }

      const payload = {
        name: user.name,
        email: user.email,
      };

      const access_token = signToken(payload);

      res.status(200).json({
        access_token,
      });
    } catch (error) {
      next(error);
    }
  }

  static async googleLogin(req, res, next) {
    try {
      const { token } = req.headers

      const { OAuth2Client } = require('google-auth-library');
      const client = new OAuth2Client();

      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      const [user, created] = await User.findOrCreate({
        where: {
          email: payload.email
        },
        defaults: {
          name: payload.email,
          email: payload.email,
          password: "password_google"
        },
        hooks: false
      })

      const access_token = signToken({
        name: user.name,
        email: user.email,
      })

      res.status(200).json({ access_token })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = UserController;

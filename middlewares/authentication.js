module.exports = {
  authenticate: async (req, res, next) => {
    try {
      const { authorization } = req.headers;

      if (!authorization) {
        throw new Error("Unauthenticated");
      }

      if (authorization.split(" ")[0] !== "Bearer") {
        throw new Error("Unauthenticated");
      }

      const token = authorization.split(" ")[1];

      const { verifyToken } = require("../helpers/jwt");
      const payload = verifyToken(token);

      const { User } = require("../models");

      const user = await User.findOne({
        where: {
          email: payload.email,
        },
      });

      req.user = {
        id: user.id,
        email: user.email,
        role: user.email,
      };

      next();
    } catch (error) {
      next(error);
    }
  },
};

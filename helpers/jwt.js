const { sign, verify } = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.SECRET_KEY;

module.exports = {
  signToken: (payload) => {
    return sign(payload, secretKey);
  },

  verifyToken: (access_token) => {
    return verify(access_token, secretKey)
  }
};
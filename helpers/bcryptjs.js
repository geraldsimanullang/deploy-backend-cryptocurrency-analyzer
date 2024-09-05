const { genSaltSync, hashSync, compareSync } = require("bcryptjs");

module.exports = {
  hash: (password) => {
    const salt = genSaltSync(8);
    return hashSync(password, salt);
  },

  compare: (password, hashedPass) => {
    return compareSync(password, hashedPass);
  },
};
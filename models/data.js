'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Data extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Data.belongsTo(models.User)
      Data.belongsTo(models.Coin)
    }
  }
  Data.init({
    UserId: DataTypes.INTEGER,
    CoinId: DataTypes.INTEGER,
    data: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Data',
  });
  return Data;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Coin extends Model {
    static associate(models) {
      Coin.hasMany(models.Portfolio)
      Coin.hasMany(models.Data)
    }
  }
  Coin.init({
    GeckoId: DataTypes.STRING,
    symbol: DataTypes.STRING,
    name: DataTypes.STRING,
    imgUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Coin',
  });
  return Coin;
};
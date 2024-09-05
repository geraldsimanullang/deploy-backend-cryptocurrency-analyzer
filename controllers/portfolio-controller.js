const { Coin, Portfolio } = require("../models");

class PortfolioController {
  static async fetchMyPortfolio(req, res, next) {
    try {
      const { id } = req.user;

      const myPortfolio = await Portfolio.findAll({
        where: {
          UserId: id
        },
        include: {
          model: Coin,
        },
      });

      res.status(200).json(myPortfolio);
    } catch (error) {
      next(error);
    }
  }

  static async addPortofolio(req, res, next) {
    try {
      const { name } = req.params;

      const coin = await Coin.findOne({
        where: {
          GeckoId: name,
        },
      });

      if (!coin) {
        throw new Error("CoinNotFound");
      }

      const { id } = req.user;

      const portfolio = await Portfolio.findOne({
        where: {
          UserId: id,
          CoinId: coin.id,
        },
      });

      if (portfolio) {
        throw new Error("PortfolioExist");
      }

      await Portfolio.create({
        UserId: id,
        CoinId: coin.id,
      });

      res.status(201).json({
        message: `${coin.name} added to portfolio`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async editNotes(req, res, next) {
    try {
      const { portfolioId } = req.params

      const { notes } = req.body

      await Portfolio.update({notes: notes}, {
        where: {
          id: portfolioId
        }
      })

      res.status(200).json()

    } catch (error) {
      next(error)
    }
  }

  static async deletePortfolio(req, res, next) {
    try {
      const { portfolioId } = req.params

      await Portfolio.destroy({
        where: {
          id: portfolioId
        }
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = PortfolioController;

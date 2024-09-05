const express = require("express");
const router = express.Router();

const UserController = require("../controllers/user-controller");
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/google-login", UserController.googleLogin);

const { authenticate } = require("../middlewares/authentication");
router.use(authenticate);

const CoinController = require("../controllers/coin-controller");
router.get("/coins", CoinController.fetchCoinList);
router.get("/coins/:name", CoinController.fetchCoinDetail);

router.get(
  "/coins/:name/historical-price-data/",
  CoinController.fetchHistoricalData
);

router.post("/coins/:name/analysis/", CoinController.runGeminiAnalysis);

const PortfolioController = require("../controllers/portfolio-controller");
router.get("/my-portfolio", PortfolioController.fetchMyPortfolio);
router.post("/portfolio/:name", PortfolioController.addPortofolio);
router.patch("/portfolio/:portfolioId", PortfolioController.editNotes);
router.delete("/portfolio/:portfolioId", PortfolioController.deletePortfolio);

// --- Error handler ---
const { handleError } = require("../middlewares/error-handler");
router.use(handleError);

module.exports = router;

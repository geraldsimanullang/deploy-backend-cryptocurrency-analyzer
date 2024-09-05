const { Coin, Data } = require("../models");
const axios = require("axios");
require("dotenv").config();

class CoinController {
  static async fetchCoinList(req, res, next) {
    try {
      const coins = await Coin.findAll();

      res.status(200).json(coins);
    } catch (error) {
      next(error);
    }
  }

  static async fetchCoinDetail(req, res, next) {
    try {
      const { name } = req.params;

      const coin = await Coin.findOne({
        where: {
          GeckoId: name,
        },
      });

      res.status(200).json(coin);
    } catch (error) {
      next(error);
    }
  }

  static async fetchHistoricalData(req, res, next) {
    try {
      const { name } = req.params;
      const { id } = req.user;
      let result;

      const coin = await Coin.findOne({
        where: {
          GeckoId: name,
        },
      });

      const existData = await Data.findOne({
        where: {
          UserId: id,
          CoinId: coin.id,
        },
      });

      if (existData) {
        const today = new Date().toISOString().split("T")[0];
        const createdAtDate = existData.createdAt.toISOString().split("T")[0];

        if (today === createdAtDate) {
          result = JSON.parse(existData.data);
        }
      } else {
        const url = `https://api.coingecko.com/api/v3/coins/${name}/market_chart?vs_currency=usd&days=365&interval=daily&precision=0`;
        const options = {
          headers: {
            accept: "application/json",
            "x-cg-demo-api-key": process.env.COINGECKO_API_KEY,
          },
        };

        const { data } = await axios.get(url, options);

        await Data.create({
          UserId: id,
          CoinId: coin.id,
          data: JSON.stringify(data),
        });

        result = data;
      }

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async runGeminiAnalysis(req, res, next) {
    try {
      const { GoogleGenerativeAI } = require("@google/generative-ai");

      const apiKey = process.env.GEMINI_API_KEY;
      const genAI = new GoogleGenerativeAI(apiKey);

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      });

      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
      };

      const { dataInJson } = req.body;
      const parsedData = JSON.parse(dataInJson)

      const { preprocess } = require("../helpers/data-preprocessing");

      const {
        preprocessedPrices,
        preprocessedMarketCaps,
        preprocessedTotalVolumes,
      } = preprocess(parsedData);

      const pricesDataInString = JSON.stringify(preprocessedPrices);
      const marketCapsDataInString = JSON.stringify(preprocessedMarketCaps);
      const totalVolumesDataInString = JSON.stringify(preprocessedTotalVolumes);

      const { name } = req.params;

      const prompt = `
        I will give you daily historical data of prices, market capacity and total volumes of cryptocurrency ${name} of one year data.
        The data are three arrays of each prices, market capacity and total volumes historical data, with format:

        [
          {
            date: "yyyy-mm-dd" (the date of three arrays will be the same) 
            price (or) market_caps (or) total_volumes : integer
          },
          ...
        ]
        
        From the data I will give, please do analysis and give me answer in json like this:

        {
          "name": ${name},
          "from": data starting date
          "to": latest data date
          "performance": (explain here your analysis of this cryptocurrency performance),
          "prediction": (explain here your prediction about the performance of this cryptocurrency in the future),
          "recommendation": (give your recommendation whether I should buy this cryptocurrency or not)
        }

        But please dont add formatting like json ''' or any markdown styling.

        I know there are many factors of cryptocurrency performance, you don't need to mention it and just do your analysis based on data objectively.

        Here are the data, give your best!

        historical data of price: 
        ${pricesDataInString}

        historical data of market capacity:
        ${marketCapsDataInString}

        historical data of total volumes:
        ${totalVolumesDataInString}
      `;

      async function run(prompt) {
        const chatSession = model.startChat({
          generationConfig,
        });

        const result = await chatSession.sendMessage(prompt);
        return result.response.text();
      }

      const analysis = await run(prompt);

      res.status(200).json(analysis);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CoinController;

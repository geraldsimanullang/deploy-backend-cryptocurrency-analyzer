module.exports = {
  preprocess: (data) => {
    const { prices, market_caps, total_volumes } = data;

    function convertUnixTimestampToDate(timestamp) {
      const date = new Date(timestamp);
      return date.toISOString().toString().split("T")[0];
    }

    const preprocessedPrices = prices.map((price) => {
      return {
        date: convertUnixTimestampToDate(price[0]),
        price: price[1],
      };
    });

    const preprocessedMarketCaps = market_caps.map((marketCap) => {
      return {
        date: convertUnixTimestampToDate(marketCap[0]),
        market_cap: marketCap[1],
      };
    });
    const preprocessedTotalVolumes = total_volumes.map((totalVolume) => {
      return {
        date: convertUnixTimestampToDate(totalVolume[0]),
        total_volume: totalVolume[1],
      };
    });

    return {
      preprocessedPrices,
      preprocessedMarketCaps,
      preprocessedTotalVolumes,
    };
  },
};

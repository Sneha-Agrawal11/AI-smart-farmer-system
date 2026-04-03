const { getBestCrops } = require("../utils/cropEngine");
const { getWeather } = require("../utils/weatherEngine");

exports.recommendCrop = async (req, res) => {
  try {
    const { location, soilType, season } = req.body;

    if (!location || !soilType || !season) {
      return res.status(400).json({ message: "location, soilType, and season are required" });
    }

    // Get weather context first
    const weatherData = await getWeather(location);

    // Get recommendations from inline engine (no ML service needed)
    const recommendedCrops = await getBestCrops(soilType, season, weatherData.temp, weatherData.rain, location);

    // Return top recommendation
    const topCrop = recommendedCrops[0] || {};
    
    res.json({
      success: true,
      recommendedCrop: topCrop.name || "Unknown",
      profitEstimate: topCrop.marketData ? `₹${topCrop.marketData.avgProfitPerAcre.toLocaleString()}/acre` : "N/A",
      riskLevel: topCrop.marketData ? topCrop.marketData.riskLevel : "Medium",
      score: topCrop.confidence || 0,
      allRecommendations: recommendedCrops,
      weather: weatherData
    });

  } catch (error) {
    console.error("Recommendation error:", error);
    res.status(500).json({ message: "Server Error ❌" });
  }
};

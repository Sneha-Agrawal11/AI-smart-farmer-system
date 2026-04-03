const FarmData = require("../models/FarmData");
const { getBestCrops } = require("../utils/cropEngine");
const { getWeather, getWeatherForecast } = require("../utils/weatherEngine");

// ======================================
// ➕ CREATE FARM
// ======================================

exports.createFarmData = async (req, res) => {
  try {
    const { soilType, season, location, area } = req.body;

    // Fetch real weather + forecast in parallel
    const [weatherData, forecastData] = await Promise.all([
      getWeather(location),
      getWeatherForecast(location),
    ]);

    // Get crop recommendations using real weather data
    const recommendedCrops = await getBestCrops(
      soilType, season, weatherData.temp, weatherData.rain, location
    );

    const weather = {
      climate: weatherData.climate,
      temp: weatherData.temp,
      rain: weatherData.rain,
      humidity: weatherData.humidity || null,
      windSpeed: weatherData.windSpeed || null,
      alerts: weatherData.alerts || [],
      description: weatherData.description || null,
      icon: weatherData.icon || null,
      cityName: weatherData.cityName || location,
    };

    const farmData = new FarmData({
      farmer: req.user.id,
      soilType,
      season,
      location,
      area,
      recommendedCrops,
      weather,
      forecast: forecastData,
    });

    await farmData.save();

    // Return full farm data with computed dashboard metrics
    const farmObj = farmData.toObject();
    const enriched = computeDashboardMetrics(farmObj);

    res.status(201).json({
      message: "Farm data saved successfully 🌾",
      farmData: enriched,
    });

  } catch (error) {
    console.error("CREATE FARM ERROR:", error);
    res.status(500).json({
      message: "Server Error ❌",
    });
  }
};

// ======================================
// 📄 GET MY FARMS (With Computed Analytics)
// ======================================

exports.getMyFarms = async (req, res) => {
  try {
    const farms = await FarmData.find({ farmer: req.user.id }).lean();

    // Compute dynamic dashboard metrics for each farm
    const farmsWithAnalytics = farms.map(farm => computeDashboardMetrics(farm));

    res.json(farmsWithAnalytics);
  } catch (error) {
    console.error("GET FARMS ERROR:", error);
    res.status(500).json({ message: "Server Error ❌" });
  }
};

// ======================================
// 🔄 REFRESH FARM DATA (Re-fetch weather + re-run crop engine)
// ======================================

exports.refreshFarm = async (req, res) => {
  try {
    const { id } = req.params;
    const farm = await FarmData.findById(id);

    if (!farm) return res.status(404).json({ message: "Farm not found ❌" });
    if (farm.farmer.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized ❌" });

    // Re-fetch live weather + forecast
    const [weatherData, forecastData] = await Promise.all([
      getWeather(farm.location),
      getWeatherForecast(farm.location),
    ]);

    // Re-run crop engine with fresh weather
    const recommendedCrops = await getBestCrops(
      farm.soilType, farm.season, weatherData.temp, weatherData.rain, farm.location
    );

    farm.weather = {
      climate: weatherData.climate,
      temp: weatherData.temp,
      rain: weatherData.rain,
      humidity: weatherData.humidity || null,
      windSpeed: weatherData.windSpeed || null,
      alerts: weatherData.alerts || [],
      description: weatherData.description || null,
      icon: weatherData.icon || null,
      cityName: weatherData.cityName || farm.location,
    };
    farm.forecast = forecastData;
    farm.recommendedCrops = recommendedCrops;

    await farm.save();

    const farmObj = farm.toObject();
    const enriched = computeDashboardMetrics(farmObj);

    res.json({
      message: "Farm data refreshed successfully ✅",
      farmData: enriched,
    });

  } catch (error) {
    console.error("REFRESH FARM ERROR:", error);
    res.status(500).json({ message: "Server Error ❌" });
  }
};

// ======================================
// ✏️ UPDATE FARM (Recalculate Crops)
// ======================================

exports.updateFarm = async (req, res) => {
  try {
    const { id } = req.params;
    const { soilType, season, location, area } = req.body;

    const farm = await FarmData.findById(id);
    if (!farm) return res.status(404).json({ message: "Farm not found ❌" });

    if (farm.farmer.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized ❌" });

    farm.soilType = soilType || farm.soilType;
    farm.season = season || farm.season;
    farm.location = location || farm.location;
    farm.area = area || farm.area;

    // Re-fetch weather + forecast
    const [weatherData, forecastData] = await Promise.all([
      getWeather(farm.location),
      getWeatherForecast(farm.location),
    ]);

    farm.recommendedCrops = await getBestCrops(
      farm.soilType, farm.season, weatherData.temp, weatherData.rain, farm.location
    );

    farm.weather = {
      climate: weatherData.climate,
      temp: weatherData.temp,
      rain: weatherData.rain,
      humidity: weatherData.humidity || null,
      windSpeed: weatherData.windSpeed || null,
      alerts: weatherData.alerts || [],
      description: weatherData.description || null,
      icon: weatherData.icon || null,
      cityName: weatherData.cityName || farm.location,
    };
    farm.forecast = forecastData;

    await farm.save();

    const farmObj = farm.toObject();
    const enriched = computeDashboardMetrics(farmObj);

    res.json({
      message: "Farm updated successfully ✅",
      farm: enriched,
    });

  } catch (error) {
    console.error("UPDATE FARM ERROR:", error);
    res.status(500).json({ message: "Server Error ❌" });
  }
};

// ======================================
// 🗑 DELETE FARM
// ======================================

exports.deleteFarm = async (req, res) => {
  try {
    const { id } = req.params;

    const farm = await FarmData.findById(id);
    if (!farm) return res.status(404).json({ message: "Farm not found ❌" });

    if (farm.farmer.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized ❌" });

    await farm.deleteOne();

    res.json({ message: "Farm deleted successfully 🗑️" });

  } catch (error) {
    res.status(500).json({ message: "Server Error ❌" });
  }
};

// ======================================
// 📊 COMPUTE DASHBOARD METRICS (Helper)
// ======================================

function computeDashboardMetrics(farm) {
  const bestCrop = farm.recommendedCrops && farm.recommendedCrops.length > 0
    ? farm.recommendedCrops[0]
    : null;

  let totalProfitEstimate = 0;
  let riskLevel = "Medium";
  let demandLevel = "Medium";
  let healthScore = 70;
  let profitPerAcre = 0;
  let confidenceScore = 0;

  if (bestCrop && bestCrop.marketData) {
    const area = farm.area || 1;
    profitPerAcre = bestCrop.marketData.avgProfitPerAcre;
    totalProfitEstimate = profitPerAcre * area;
    riskLevel = bestCrop.marketData.riskLevel || "Medium";
    demandLevel = bestCrop.marketData.demandLevel || "Medium";
    confidenceScore = bestCrop.confidence || bestCrop.score || 0;

    // Health score from confidence
    healthScore = Math.min(100, Math.round(50 + confidenceScore * 0.5));
  }

  // Weather impacts on health score
  if (farm.weather) {
    const temp = farm.weather.temp;
    if (temp > 40) healthScore -= 15;
    else if (temp > 35 || temp < 10) healthScore -= 10;
    else if (temp < 5) healthScore -= 20;

    if (farm.weather.humidity > 90) healthScore -= 5;
    if (farm.weather.rain > 100) healthScore -= 10;

    if (farm.weather.alerts && farm.weather.alerts.length > 0) {
      healthScore -= (farm.weather.alerts.length * 3);
    }
  }

  healthScore = Math.max(20, Math.min(100, healthScore));

  // Compute percentage change indicators based on demand and risk
  const demandChangeMap = { "High": "+12%", "Medium": "+5%", "Low": "-2%" };
  const riskChangeMap = { "Low": "Safe", "Medium": "Moderate", "High": "Caution" };

  // Profit change based on price trend
  const profitTrendMap = { "Rising": "+8%", "Stable": "+2%", "Volatile": "±5%", "Declining": "-4%" };
  const profitChange = bestCrop?.marketData?.priceTrend
    ? (profitTrendMap[bestCrop.marketData.priceTrend] || "+2%")
    : "+0%";

  return {
    ...farm,
    dashboardMetrics: {
      totalProfitEstimate,
      profitPerAcre,
      riskLevel,
      demandLevel,
      healthScore,
      confidenceScore: Math.round(confidenceScore),
      insights: farm.weather ? farm.weather.alerts || [] : [],
      profitChange,
      demandChange: demandChangeMap[demandLevel] || "+5%",
      riskChange: riskChangeMap[riskLevel] || "Moderate",
      cropsAnalyzed: farm.recommendedCrops ? farm.recommendedCrops.length : 0,
    }
  };
}
const mongoose = require("mongoose");

const farmDataSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Farmer",
    required: true,
  },
  soilType: {
    type: String,
    required: true,
  },
  season: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  area: {
    type: Number,
    default: 1,
  },
  predictedCrop: {
    type: String,
  },
  weather: {
    climate: { type: String, default: null },
    temp: { type: Number, default: null },
    rain: { type: Number, default: null },
    humidity: { type: Number, default: null },
    windSpeed: { type: Number, default: null },
    alerts: [String],
    description: { type: String, default: null },
    icon: { type: String, default: null },
    cityName: { type: String, default: null },
  },
  forecast: [
    {
      date: String,
      day: String,
      temp: Number,
      tempMax: Number,
      tempMin: Number,
      humidity: Number,
      rain: Number,
      rainLevel: String,
      hasRain: Boolean,
      windSpeed: Number,
      description: String,
      icon: String,
    },
  ],
  recommendedCrops: [
    {
      name: String,
      confidence: Number,
      score: Number,
      tag: String,
      marketData: {
        demandLevel: String,
        priceTrend: String,
        bestSellingMonths: [String],
        avgProfitPerAcre: Number,
        riskLevel: String,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("FarmData", farmDataSchema);
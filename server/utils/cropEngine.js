// ======================================
// 🎯 INLINE CROP RECOMMENDATION ENGINE
// No Python ML service needed — rule-based scoring directly in Node.js
// ======================================

// Comprehensive Indian crop database with market data
const CROP_DATA = [
  { name: "Rice", seasons: ["Kharif"], soils: ["Alluvial", "Clay"], tempRange: [20, 35], rainRange: [100, 300], demandLevel: "High", priceTrend: "Stable", avgProfitPerAcre: 45000, riskLevel: "Low", bestSellingMonths: ["Oct", "Nov", "Dec"] },
  { name: "Maize", seasons: ["Kharif", "Rabi"], soils: ["Alluvial", "Red Soil", "Loamy"], tempRange: [18, 27], rainRange: [50, 100], demandLevel: "High", priceTrend: "Rising", avgProfitPerAcre: 35000, riskLevel: "Low", bestSellingMonths: ["Sep", "Oct", "Mar"] },
  { name: "Cotton", seasons: ["Kharif"], soils: ["Black (Regur)", "Clay"], tempRange: [21, 30], rainRange: [50, 100], demandLevel: "High", priceTrend: "Rising", avgProfitPerAcre: 55000, riskLevel: "Medium", bestSellingMonths: ["Nov", "Dec", "Jan"] },
  { name: "Soybean", seasons: ["Kharif"], soils: ["Black (Regur)", "Alluvial", "Loamy"], tempRange: [20, 30], rainRange: [60, 100], demandLevel: "High", priceTrend: "Rising", avgProfitPerAcre: 40000, riskLevel: "Low", bestSellingMonths: ["Oct", "Nov"] },
  { name: "Groundnut", seasons: ["Kharif"], soils: ["Sandy", "Red Soil"], tempRange: [25, 30], rainRange: [50, 100], demandLevel: "Medium", priceTrend: "Stable", avgProfitPerAcre: 38000, riskLevel: "Medium", bestSellingMonths: ["Oct", "Nov", "Dec"] },
  { name: "Sugarcane", seasons: ["Kharif", "Perennial"], soils: ["Alluvial", "Loamy"], tempRange: [20, 35], rainRange: [100, 150], demandLevel: "High", priceTrend: "Stable", avgProfitPerAcre: 80000, riskLevel: "Low", bestSellingMonths: ["Jan", "Feb", "Mar"] },
  { name: "Wheat", seasons: ["Rabi"], soils: ["Alluvial", "Loamy", "Clay"], tempRange: [10, 25], rainRange: [50, 100], demandLevel: "High", priceTrend: "Stable", avgProfitPerAcre: 50000, riskLevel: "Low", bestSellingMonths: ["Mar", "Apr", "May"] },
  { name: "Mustard", seasons: ["Rabi"], soils: ["Alluvial", "Red Soil", "Loamy"], tempRange: [10, 25], rainRange: [20, 50], demandLevel: "High", priceTrend: "Rising", avgProfitPerAcre: 42000, riskLevel: "Low", bestSellingMonths: ["Feb", "Mar"] },
  { name: "Gram (Chickpea)", seasons: ["Rabi"], soils: ["Black (Regur)", "Alluvial", "Loamy"], tempRange: [20, 30], rainRange: [40, 50], demandLevel: "High", priceTrend: "Stable", avgProfitPerAcre: 38000, riskLevel: "Low", bestSellingMonths: ["Mar", "Apr"] },
  { name: "Watermelon", seasons: ["Zaid"], soils: ["Sandy", "Loamy"], tempRange: [25, 35], rainRange: [20, 40], demandLevel: "High", priceTrend: "Rising", avgProfitPerAcre: 60000, riskLevel: "Medium", bestSellingMonths: ["Apr", "May", "Jun"] },
  { name: "Tomato", seasons: ["Kharif", "Rabi", "Zaid", "Perennial"], soils: ["Alluvial", "Red Soil", "Loamy"], tempRange: [15, 30], rainRange: [40, 60], demandLevel: "High", priceTrend: "Rising", avgProfitPerAcre: 70000, riskLevel: "Medium", bestSellingMonths: ["Dec", "Jan", "Feb", "Mar"] },
  { name: "Onion", seasons: ["Kharif", "Rabi", "Zaid", "Perennial"], soils: ["Black (Regur)", "Alluvial", "Loamy"], tempRange: [15, 30], rainRange: [30, 70], demandLevel: "High", priceTrend: "Volatile", avgProfitPerAcre: 55000, riskLevel: "Medium", bestSellingMonths: ["Nov", "Dec", "Jan"] },
  { name: "Potato", seasons: ["Rabi", "Zaid", "Perennial"], soils: ["Alluvial", "Loamy"], tempRange: [15, 25], rainRange: [50, 70], demandLevel: "High", priceTrend: "Stable", avgProfitPerAcre: 48000, riskLevel: "Low", bestSellingMonths: ["Jan", "Feb", "Mar"] },
  { name: "Jute", seasons: ["Kharif"], soils: ["Alluvial", "Clay"], tempRange: [24, 35], rainRange: [150, 250], demandLevel: "Medium", priceTrend: "Stable", avgProfitPerAcre: 32000, riskLevel: "Medium", bestSellingMonths: ["Aug", "Sep", "Oct"] },
  { name: "Turmeric", seasons: ["Kharif", "Perennial"], soils: ["Loamy", "Alluvial", "Clay"], tempRange: [20, 30], rainRange: [100, 200], demandLevel: "High", priceTrend: "Rising", avgProfitPerAcre: 75000, riskLevel: "Low", bestSellingMonths: ["Jan", "Feb", "Mar"] },
];

// Map form soil types to crop database soil types
const SOIL_TYPE_MAP = {
  "clay": "Clay",
  "sandy": "Sandy",
  "loamy": "Loamy",
  "silt": "Alluvial",
  "peat": "Alluvial",
  "chalk": "Red Soil",
  "alluvial": "Alluvial",
  "red soil": "Red Soil",
  "red": "Red Soil",
  "black": "Black (Regur)",
  "black (regur)": "Black (Regur)",
  "laterite": "Red Soil",
};

// Normalize season input
function normalizeSeason(season) {
  if (!season) return "Kharif";
  const s = season.trim().toLowerCase();
  if (s === "kharif") return "Kharif";
  if (s === "rabi") return "Rabi";
  if (s === "zaid") return "Zaid";
  if (s === "perennial") return "Perennial";
  // Try capitalizing first letter
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Normalize soil type input
function normalizeSoilType(soil) {
  if (!soil) return "Loamy";
  const s = soil.trim().toLowerCase();
  return SOIL_TYPE_MAP[s] || soil.charAt(0).toUpperCase() + soil.slice(1);
}

// Regional price adjustment factors
const REGIONAL_PRICE_FACTORS = {
  "punjab": 1.15, "haryana": 1.12, "uttar pradesh": 1.05, "up": 1.05,
  "maharashtra": 1.10, "madhya pradesh": 1.08, "mp": 1.08,
  "rajasthan": 0.95, "gujarat": 1.05, "kerala": 1.20,
  "karnataka": 1.08, "tamil nadu": 1.10, "tn": 1.10,
  "west bengal": 1.02, "bengal": 1.02, "andhra pradesh": 1.06, "ap": 1.06,
  "telangana": 1.07, "bihar": 0.92, "odisha": 0.95,
  "assam": 0.90, "jharkhand": 0.93, "chhattisgarh": 0.96,
};

function getRegionalPriceFactor(location) {
  if (!location) return 1.0;
  const loc = location.toLowerCase();
  for (const [region, factor] of Object.entries(REGIONAL_PRICE_FACTORS)) {
    if (loc.includes(region)) return factor;
  }
  return 1.0;
}

// Calculate confidence score for a crop match
function calculateScore(crop, normalizedSoil, normalizedSeason, temperature, rainfall) {
  let score = 0;

  // Season match (30 pts max)
  if (crop.seasons.includes(normalizedSeason) || crop.seasons.includes("Perennial")) {
    score += 30;
  }

  // Soil match (25 pts max) — also check mapped equivalents
  const soilMatches = crop.soils.some(s => {
    if (s === normalizedSoil) return true;
    // Clay ≈ Black (Regur) for many crops
    if (normalizedSoil === "Clay" && s === "Black (Regur)") return true;
    if (normalizedSoil === "Black (Regur)" && s === "Clay") return true;
    // Silt/Peat ≈ Alluvial
    if (normalizedSoil === "Alluvial" && (s === "Loamy" || s === "Clay")) return true;
    return false;
  });
  if (soilMatches) {
    score += 25;
  }

  // Temperature match (20 pts max) — gaussian falloff
  const [tMin, tMax] = crop.tempRange;
  if (temperature >= tMin && temperature <= tMax) {
    score += 20;
  } else {
    const diff = Math.min(Math.abs(temperature - tMin), Math.abs(temperature - tMax));
    score += Math.max(0, 20 - diff * 2);
  }

  // Rainfall match (15 pts max)
  const [rMin, rMax] = crop.rainRange;
  if (rainfall >= rMin && rainfall <= rMax) {
    score += 15;
  } else {
    const diff = Math.min(Math.abs(rainfall - rMin), Math.abs(rainfall - rMax));
    score += Math.max(0, 15 - diff * 0.5);
  }

  // Small deterministic variation based on crop name (replaces random)
  const nameHash = crop.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  score += (nameHash % 5);

  return Math.min(99.9, Math.max(0, score));
}

// ======================================
// 🎯 MAIN RECOMMENDATION FUNCTION
// ======================================
async function getBestCrops(soilType, season, temperature, rainfall, location) {
  const normalizedSoil = normalizeSoilType(soilType);
  const normalizedSeason = normalizeSeason(season);
  const priceFactor = getRegionalPriceFactor(location);

  const results = CROP_DATA.map(crop => {
    const conf = calculateScore(crop, normalizedSoil, normalizedSeason, temperature, rainfall);
    const adjustedProfit = Math.round(crop.avgProfitPerAcre * priceFactor);

    return {
      name: crop.name,
      confidence: parseFloat(conf.toFixed(2)),
      score: parseFloat(conf.toFixed(2)),
      marketData: {
        demandLevel: crop.demandLevel,
        priceTrend: crop.priceTrend,
        avgProfitPerAcre: adjustedProfit,
        riskLevel: crop.riskLevel,
        bestSellingMonths: crop.bestSellingMonths,
      }
    };
  });

  // Sort by confidence descending
  results.sort((a, b) => b.confidence - a.confidence);

  // Take top 5
  const top = results.slice(0, 5);

  // Add tags
  if (top[0]) top[0].tag = "Best Match";
  if (top[1]) top[1].tag = "Recommended";
  if (top[2]) top[2].tag = "Alternative";
  if (top[3]) top[3].tag = "Consider";
  if (top[4]) top[4].tag = "Backup";

  return top;
}

module.exports = { getBestCrops };

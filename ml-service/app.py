from flask import Flask, request, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

# Comprehensive Dataset Mock/Rule-base
CROP_DATA = [
    {"name": "Rice", "seasons": ["Kharif"], "soils": ["Alluvial"], "temp_range": (20, 35), "rain_range": (100, 300), "demandLevel": "High", "priceTrend": "Stable", "avgProfitPerAcre": 45000, "riskLevel": "Low"},
    {"name": "Maize", "seasons": ["Kharif", "Rabi"], "soils": ["Alluvial", "Red Soil"], "temp_range": (18, 27), "rain_range": (50, 100), "demandLevel": "High", "priceTrend": "Rising", "avgProfitPerAcre": 35000, "riskLevel": "Low"},
    {"name": "Cotton", "seasons": ["Kharif"], "soils": ["Black (Regur)"], "temp_range": (21, 30), "rain_range": (50, 100), "demandLevel": "High", "priceTrend": "Rising", "avgProfitPerAcre": 55000, "riskLevel": "Medium"},
    {"name": "Soybean", "seasons": ["Kharif"], "soils": ["Black (Regur)", "Alluvial"], "temp_range": (20, 30), "rain_range": (60, 100), "demandLevel": "High", "priceTrend": "Rising", "avgProfitPerAcre": 40000, "riskLevel": "Low"},
    {"name": "Groundnut", "seasons": ["Kharif"], "soils": ["Sandy", "Red Soil"], "temp_range": (25, 30), "rain_range": (50, 100), "demandLevel": "Medium", "priceTrend": "Stable", "avgProfitPerAcre": 38000, "riskLevel": "Medium"},
    {"name": "Sugarcane", "seasons": ["Kharif"], "soils": ["Alluvial"], "temp_range": (20, 35), "rain_range": (100, 150), "demandLevel": "High", "priceTrend": "Stable", "avgProfitPerAcre": 80000, "riskLevel": "Low"},
    {"name": "Wheat", "seasons": ["Rabi"], "soils": ["Alluvial"], "temp_range": (10, 25), "rain_range": (50, 100), "demandLevel": "High", "priceTrend": "Stable", "avgProfitPerAcre": 50000, "riskLevel": "Low"},
    {"name": "Mustard", "seasons": ["Rabi"], "soils": ["Alluvial", "Red Soil"], "temp_range": (10, 25), "rain_range": (20, 50), "demandLevel": "High", "priceTrend": "Rising", "avgProfitPerAcre": 42000, "riskLevel": "Low"},
    {"name": "Gram", "seasons": ["Rabi"], "soils": ["Black (Regur)", "Alluvial"], "temp_range": (20, 30), "rain_range": (40, 50), "demandLevel": "High", "priceTrend": "Stable", "avgProfitPerAcre": 38000, "riskLevel": "Low"},
    {"name": "Watermelon", "seasons": ["Zaid"], "soils": ["Sandy"], "temp_range": (25, 35), "rain_range": (20, 40), "demandLevel": "High", "priceTrend": "Rising", "avgProfitPerAcre": 60000, "riskLevel": "Medium"},
    {"name": "Tomato", "seasons": ["All", "Kharif", "Rabi", "Zaid"], "soils": ["Alluvial", "Red Soil"], "temp_range": (15, 30), "rain_range": (40, 60), "demandLevel": "High", "priceTrend": "Rising", "avgProfitPerAcre": 70000, "riskLevel": "Medium"},
    {"name": "Onion", "seasons": ["All", "Kharif", "Rabi", "Zaid"], "soils": ["Black (Regur)", "Alluvial"], "temp_range": (15, 30), "rain_range": (30, 70), "demandLevel": "High", "priceTrend": "Volatile", "avgProfitPerAcre": 55000, "riskLevel": "Medium"},
    {"name": "Potato", "seasons": ["All", "Kharif", "Rabi", "Zaid"], "soils": ["Alluvial"], "temp_range": (15, 25), "rain_range": (50, 70), "demandLevel": "High", "priceTrend": "Stable", "avgProfitPerAcre": 48000, "riskLevel": "Low"},
]

def calculate_score(crop, soil, season, temp, rain):
    score = 0
    # Match season
    if season in crop["seasons"] or "All" in crop["seasons"]:
        score += 30
    
    # Match soil
    if soil in crop["soils"] or "All" in crop["soils"]:
        score += 25
    
    # Temp matching - gaussian like fallback
    t_min, t_max = crop["temp_range"]
    if t_min <= temp <= t_max:
        score += 20
    else:
        diff = min(abs(temp - t_min), abs(temp - t_max))
        score += max(0, 20 - diff * 2)
        
    # Rain matching
    r_min, r_max = crop["rain_range"]
    if r_min <= rain <= r_max:
        score += 15
    else:
        diff = min(abs(rain - r_min), abs(rain - r_max))
        score += max(0, 15 - diff * 0.5)

    # Some randomness to mimic ML confidence variations slightly between calls
    score += random.uniform(-2, 5)
    
    # Cap at 99.9 maximum confidence
    return min(99.9, score)

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        soil = data.get("soilType", "Alluvial")
        season = data.get("season", "Kharif")
        
        # In a real scenario, temp and rain would come from the weather API instead of hardcoded/guess
        temp = float(data.get("temperature", 25.0))
        rain = float(data.get("rainfall", 100.0))

        results = []
        for crop in CROP_DATA:
            conf = calculate_score(crop, soil, season, temp, rain)
            results.append({
                "name": crop["name"],
                "confidence": round(conf, 2),
                "marketData": {
                    "demandLevel": crop["demandLevel"],
                    "priceTrend": crop["priceTrend"],
                    "avgProfitPerAcre": crop["avgProfitPerAcre"],
                    "riskLevel": crop["riskLevel"]
                }
            })
            
        # Sort by best confidence
        results.sort(key=lambda x: x["confidence"], reverse=True)
        top_3 = results[:3]
        
        # Add a tag to the top
        if top_3:
            top_3[0]["tag"] = "Best Match"
        if len(top_3) > 1:
            top_3[1]["tag"] = "Recommended"
        if len(top_3) > 2:
            top_3[2]["tag"] = "Alternative"

        return jsonify({
            "success": True,
            "recommendations": top_3
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)

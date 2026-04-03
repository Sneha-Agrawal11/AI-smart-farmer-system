const axios = require("axios");

const apiKey = process.env.OPENWEATHER_API_KEY || "";

// ======================================
// 🌤️ GET CURRENT WEATHER (Celsius)
// ======================================
async function getWeather(location) {
  try {
    if (!apiKey || apiKey === "YOUR_OPENWEATHER_API_KEY") {
      console.warn("No OpenWeather API key found. Using realistic fallback data.");
      return getFallbackWeather(location);
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`,
      { timeout: 8000 }
    );

    const data = response.data;
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind ? data.wind.speed : 0;

    // Rain volume estimation
    let rainVolume = 0;
    if (data.rain && data.rain["1h"]) {
      rainVolume = data.rain["1h"] * 24;
    } else if (data.rain && data.rain["3h"]) {
      rainVolume = data.rain["3h"] * 8;
    } else if (data.weather[0].main.toLowerCase() === "rain") {
      rainVolume = 20;
    }

    // Determine climate type
    let climate = "Moderate";
    if (temp > 35) climate = "Very Hot";
    else if (temp > 30 && humidity < 40) climate = "Hot & Dry";
    else if (temp > 28 && humidity > 70) climate = "Hot & Humid";
    else if (temp > 25) climate = "Warm";
    else if (temp >= 20) climate = "Moderate";
    else if (temp >= 10) climate = "Cool";
    else climate = "Cold";

    const alerts = generateAlerts(temp, humidity, rainVolume, windSpeed);

    return {
      climate,
      temp: parseFloat(temp.toFixed(1)),
      rain: parseFloat(rainVolume.toFixed(1)),
      humidity,
      windSpeed: parseFloat(windSpeed.toFixed(1)),
      alerts,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      cityName: data.name,
    };

  } catch (error) {
    console.error("OpenWeather API Error:", error.message);
    return getFallbackWeather(location);
  }
}

// ======================================
// 📅 GET 5-DAY WEATHER FORECAST
// ======================================
async function getWeatherForecast(location) {
  try {
    if (!apiKey || apiKey === "YOUR_OPENWEATHER_API_KEY") {
      return getFallbackForecast(location);
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric&cnt=40`,
      { timeout: 8000 }
    );

    const data = response.data;

    // Group by day (API returns 3-hour intervals)
    const dailyMap = {};
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toISOString().split("T")[0];

      if (!dailyMap[dayKey]) {
        dailyMap[dayKey] = {
          date: dayKey,
          day: dayNames[date.getDay()],
          temps: [],
          humidities: [],
          rainVolumes: [],
          windSpeeds: [],
          descriptions: [],
          icons: [],
        };
      }

      dailyMap[dayKey].temps.push(item.main.temp);
      dailyMap[dayKey].humidities.push(item.main.humidity);
      dailyMap[dayKey].windSpeeds.push(item.wind ? item.wind.speed : 0);
      dailyMap[dayKey].descriptions.push(item.weather[0].description);
      dailyMap[dayKey].icons.push(item.weather[0].icon);

      let rain = 0;
      if (item.rain && item.rain["3h"]) rain = item.rain["3h"];
      dailyMap[dayKey].rainVolumes.push(rain);
    });

    // Convert to array and compute daily averages
    const forecast = Object.values(dailyMap).slice(0, 5).map(day => {
      const avgTemp = day.temps.reduce((a, b) => a + b, 0) / day.temps.length;
      const maxTemp = Math.max(...day.temps);
      const minTemp = Math.min(...day.temps);
      const avgHumidity = Math.round(day.humidities.reduce((a, b) => a + b, 0) / day.humidities.length);
      const totalRain = day.rainVolumes.reduce((a, b) => a + b, 0);
      const avgWind = day.windSpeeds.reduce((a, b) => a + b, 0) / day.windSpeeds.length;

      // Most common description (noon entry preferred)
      const midIndex = Math.floor(day.descriptions.length / 2);
      const description = day.descriptions[midIndex] || day.descriptions[0];
      const icon = day.icons[midIndex] || day.icons[0];

      let rainLevel = "Low";
      if (totalRain > 10) rainLevel = "High";
      else if (totalRain > 2) rainLevel = "Medium";

      return {
        date: day.date,
        day: day.day,
        temp: parseFloat(avgTemp.toFixed(1)),
        tempMax: parseFloat(maxTemp.toFixed(1)),
        tempMin: parseFloat(minTemp.toFixed(1)),
        humidity: avgHumidity,
        rain: parseFloat(totalRain.toFixed(1)),
        rainLevel,
        hasRain: totalRain > 0.5,
        windSpeed: parseFloat(avgWind.toFixed(1)),
        description,
        icon,
      };
    });

    return forecast;

  } catch (error) {
    console.error("Forecast API Error:", error.message);
    return getFallbackForecast(location);
  }
}

// ======================================
// ⚠️ GENERATE WEATHER ALERTS
// ======================================
function generateAlerts(temp, humidity, rainVolume, windSpeed = 0) {
  const alerts = [];
  if (temp > 40) alerts.push("Extreme heat warning 🔥 Avoid field work during peak hours. Increase irrigation frequency.");
  else if (temp > 35) alerts.push("High temperature detected 🌡️ Increase irrigation to prevent heat stress.");
  if (temp < 5) alerts.push("Frost warning ❄️ Cover sensitive crops immediately.");
  else if (temp < 10) alerts.push("Low temperature warning 🥶 Protect sensitive crops from cold damage.");
  if (rainVolume > 100) alerts.push("Flood risk 🌊 Ensure proper drainage and avoid low-lying storage.");
  else if (rainVolume > 50) alerts.push("Heavy rain expected 🌧️ Avoid pesticide spraying and ensure drainage.");
  if (rainVolume === 0 && temp > 30) alerts.push("Dry spell warning 🏜️ Check soil moisture levels and plan irrigation.");
  if (humidity > 90) alerts.push("Very high humidity 💧 High risk of fungal infections. Apply preventive fungicide.");
  else if (humidity > 85) alerts.push("High humidity 💧 Watch out for fungal infections on leaves.");
  if (windSpeed > 15) alerts.push("Strong winds expected 💨 Secure young plants and avoid spraying.");
  return alerts;
}

// ======================================
// 🔄 FALLBACK DATA (when API is unavailable)
// ======================================
function getFallbackWeather(location) {
  const loc = (location || "").toLowerCase();

  let temp = 28, rainVolume = 10, humidity = 60, climate = "Warm";

  if (loc.includes("punjab") || loc.includes("haryana") || loc.includes("chandigarh")) {
    temp = 22; rainVolume = 5; humidity = 40; climate = "Cool";
  } else if (loc.includes("rajasthan") || loc.includes("jaisalmer") || loc.includes("jodhpur")) {
    temp = 35; rainVolume = 0; humidity = 25; climate = "Hot & Dry";
  } else if (loc.includes("kerala") || loc.includes("mumbai") || loc.includes("goa")) {
    temp = 29; rainVolume = 25; humidity = 85; climate = "Hot & Humid";
  } else if (loc.includes("delhi") || loc.includes("lucknow") || loc.includes("up")) {
    temp = 30; rainVolume = 8; humidity = 55; climate = "Warm";
  } else if (loc.includes("bengal") || loc.includes("kolkata")) {
    temp = 31; rainVolume = 15; humidity = 78; climate = "Hot & Humid";
  } else if (loc.includes("shimla") || loc.includes("manali") || loc.includes("kashmir")) {
    temp = 12; rainVolume = 15; humidity = 70; climate = "Cool";
  }

  return {
    climate,
    temp: parseFloat(temp.toFixed(1)),
    rain: parseFloat(rainVolume.toFixed(1)),
    humidity,
    windSpeed: 5.0,
    alerts: generateAlerts(temp, humidity, rainVolume),
    description: "Estimated (API fallback)",
    icon: "02d",
    cityName: location,
  };
}

function getFallbackForecast(location) {
  const base = getFallbackWeather(location);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return Array.from({ length: 5 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const tempVar = Math.sin(i * 0.8) * 3;
    const dayTemp = parseFloat((base.temp + tempVar).toFixed(1));
    const rain = parseFloat(Math.max(0, base.rain + (i % 2 === 0 ? 5 : -3)).toFixed(1));

    return {
      date: date.toISOString().split("T")[0],
      day: dayNames[date.getDay()],
      temp: dayTemp,
      tempMax: parseFloat((dayTemp + 3).toFixed(1)),
      tempMin: parseFloat((dayTemp - 3).toFixed(1)),
      humidity: base.humidity + (i * 2 - 4),
      rain,
      rainLevel: rain > 10 ? "High" : rain > 2 ? "Medium" : "Low",
      hasRain: rain > 0.5,
      windSpeed: parseFloat((base.windSpeed + i * 0.5).toFixed(1)),
      description: base.description,
      icon: "02d",
    };
  });
}

module.exports = { getWeather, getWeatherForecast };

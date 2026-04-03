export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface User {
  name: string;
  email: string;
  location: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface PhoneLoginRequest {
  firebaseToken: string;
}

export interface LoginResponse {
  message: string;
  token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ForecastDay {
  date: string;
  day: string;
  temp: number;
  tempMax: number;
  tempMin: number;
  humidity: number;
  rain: number;
  rainLevel: string;
  hasRain: boolean;
  windSpeed: number;
  description: string;
  icon: string;
}

export interface FarmData {
  _id: string;
  farmer: string;
  location: string;
  soilType: string;
  season: string;
  area: number;
  recommendedCrops: Array<{
    name: string;
    confidence: number;
    score?: number;
    tag: string;
    marketData: {
      demandLevel: string;
      priceTrend: string;
      bestSellingMonths?: string[];
      avgProfitPerAcre: number;
      riskLevel: string;
    };
  }>;
  weather: {
    climate: string;
    temp: number;
    rain: number;
    humidity?: number;
    windSpeed?: number;
    alerts?: string[];
    description?: string;
    icon?: string;
    cityName?: string;
  };
  forecast?: ForecastDay[];
  dashboardMetrics?: {
    totalProfitEstimate: number;
    profitPerAcre: number;
    riskLevel: string;
    demandLevel: string;
    healthScore: number;
    confidenceScore: number;
    insights: string[];
    profitChange: string;
    demandChange: string;
    riskChange: string;
    cropsAnalyzed: number;
  };
  createdAt?: string;
}

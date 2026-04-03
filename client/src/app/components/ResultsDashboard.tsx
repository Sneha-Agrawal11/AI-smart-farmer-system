import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useLocation } from "react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { farmsAPI, dashboardAPI, chatAPI, FarmData } from "../services/api";
import {
  Cloud,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  Droplet,
  Leaf,
  Sprout,
  X,
  Send,
  Home,
  BarChart3,
  Calendar,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  ChevronRight,
  Mic,
  Sparkles,
  Target,
  MapPin,
  Gift,
  Activity,
  Zap,
  Award,
  ChevronLeft,
  LineChart,
  TrendingDown,
  Users,
  Shield,
  Layers,
  Sun,
  Wind,
  Thermometer,
  Droplets,
  Tractor,
  Wheat,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Search,
  MoreHorizontal,
  RefreshCw,
  Download,
  Filter,
  Plus,
  AlertCircle as AlertCircleIcon,
  User,
  Volume2,
  Octagon,
  StopCircle,
  MicOff,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Input,
} from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Button,
} from "./ui/button";
import {
  Label,
} from "./ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  LineChart as RechartsLine,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Legend,
} from "recharts";

export function ResultsDashboard() {

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const cleanName = (user?.name || "").replace(/\\n|\n/g, "").trim();


  const navigate = useNavigate();
  const location = useLocation();
  const stateData = location.state || {};
  const [farms, setFarms] = useState<FarmData[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [currentFarm, setCurrentFarm] = useState<any>(stateData);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
 

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: "bot",
      message: "👋 Hello! I'm your AI farming assistant. How can I help you today?"
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Voice & Speech States
  const [isListening, setIsListening] = useState(false);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const [isReadingRecs, setIsReadingRecs] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Settings form states
  const [farmLocation, setFarmLocation] = useState("");
  const [soilType, setSoilType] = useState("");
  const [season, setSeason] = useState("");

  const chatRef = useRef<HTMLDivElement>(null);

  // --- TEXT TO SPEECH (TTS) ---
  const speakHindi = useCallback((text: string, isBotReply: boolean = false) => {
    window.speechSynthesis.cancel();
    if (!text) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to explicitly apply the Hindi Voice
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => v.lang === "hi-IN" || v.lang === "hi_IN");
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }
    
    utterance.lang = "hi-IN";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    if (isBotReply) {
      setIsBotSpeaking(true);
      utterance.onend = () => setIsBotSpeaking(false);
      utterance.onerror = () => setIsBotSpeaking(false);
    } else {
      setIsReadingRecs(true);
      utterance.onend = () => setIsReadingRecs(false);
      utterance.onerror = () => setIsReadingRecs(false);
    }
    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsBotSpeaking(false);
    setIsReadingRecs(false);
  }, []);

  // --- SPEECH RECOGNITION (STT) ---
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Browser doesn't support speech recognition.");
      return;
    }
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognitionAPI();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'hi-IN';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setIsListening(false);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    } else {
      startListening();
    }
  };

  // Stop strictly if chat closes
  useEffect(() => {
    if (!chatOpen && isBotSpeaking) {
      stopSpeaking();
    }
  }, [chatOpen, isBotSpeaking, stopSpeaking]);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);



  // Handle ESC key to close chat
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && chatOpen) {
        setChatOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [chatOpen]);

  // Handle click outside chat to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(e.target as Node) && chatOpen) {
        setChatOpen(false);
      }
    };
    if (chatOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [chatOpen]);

  // Responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Search click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search debounce effect
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

const topCrop = currentFarm?.recommendedCrops?.[0];
const cropConfidence = topCrop?.confidence || topCrop?.score || 0;
const baseTemp = Number(currentFarm?.weather?.temp) || 25;

  // Professional dynamic recommendation mappings (Task 1)
  type CropRecommendation = {
    pesticide: string;
    fertilizer: string;
  };

  const cropRecommendations: Record<string, CropRecommendation> = {
    Rice: { pesticide: "Neem oil spray", fertilizer: "Urea + DAP" },
    Wheat: { pesticide: "Chlorpyrifos", fertilizer: "NPK 20:20:20" },
    Cotton: { pesticide: "Imidacloprid", fertilizer: "Potash rich fertilizer" },
  } as const;

  const getCropRecommendation = (cropName: string | undefined): CropRecommendation => {
    return cropRecommendations[cropName || ''] || { pesticide: "General organic pesticide", fertilizer: "Balanced NPK fertilizer" };
  };

  const demandTrendMap: Record<string, string> = {
    High: "+12%",  // Midpoint of +10% to +15%
    Medium: "+7%", // Midpoint of +5% to +10%
    Low: "0%"     // Midpoint of -5% to +5%
  };

  const getDemandTrend = (demandLevel: string | undefined): string => {
    return demandTrendMap[demandLevel || 'Medium'] || 'N/A';
  };

  const baseRainLevel = currentFarm?.weather?.rain ? (Number(currentFarm.weather.rain) > 50 ? 'High' : Number(currentFarm.weather.rain) > 15 ? 'Medium' : 'Low') : 'Medium';
  const rainLevels = ['Low', 'Medium', 'High'];
  const baseRainIndex = rainLevels.indexOf(baseRainLevel);

  const weeklyForecast = currentFarm?.forecast?.slice(0, 5).map((f: any) => ({
    day: f.day,
    temp: `${Math.round(f.temp)}°`,
    hasRain: f.hasRain,
    rainLevel: f.rainLevel
  })) || [];

  const recommendations = {
    crop: topCrop?.name || "Analyzing...",
    weather: {
      temp: currentFarm?.weather?.temp ? `${currentFarm.weather.temp}°C` : "Loading...",
      humidity: currentFarm?.weather?.humidity || "N/A",
      condition: currentFarm?.weather?.climate || "Loading...",
      rainfall: currentFarm?.weather?.rain || "N/A",
      weeklyForecast // Add forecast data
    },
     

  profit: topCrop?.marketData
    ? `₹${topCrop.marketData.avgProfitPerAcre.toLocaleString()} - ₹${Math.round(topCrop.marketData.avgProfitPerAcre * 1.2).toLocaleString()}`
    : "N/A",

  profitPerAcre: "per acre",

  marketDemand: topCrop?.marketData?.demandLevel || "Unknown",

  demandTrend: getDemandTrend(topCrop?.marketData?.demandLevel), // Dynamic from demandLevel (Task 2)

  riskLevel: topCrop?.marketData?.riskLevel || "Analyzing...",

  riskScore: Math.min(100, Math.max(0, Math.round(cropConfidence))),

  healthScore: currentFarm?.dashboardMetrics?.healthScore || Math.min(100, Math.max(0, Math.round(cropConfidence))),

  pesticide: getCropRecommendation(topCrop?.name).pesticide, // Crop-specific (Task 4)

  fertilizer: getCropRecommendation(topCrop?.name).fertilizer, // Crop-specific (Task 4)
  };

  const metricCards = currentFarm?.dashboardMetrics ? [
    {
      title: "Estimated Profit",
      value: `₹${currentFarm?.dashboardMetrics?.totalProfitEstimate?.toLocaleString() || 'N/A'}`,
      change: currentFarm?.dashboardMetrics?.profitChange || "+0%",
      trend: (currentFarm?.dashboardMetrics?.profitChange || "").includes("-") ? "down" : "up",
      icon: DollarSign,
      color: "emerald",
      subtitle: `Total for ${currentFarm?.area || 1} acres`
    },
    {
      title: "Demand Level",
      value: currentFarm?.dashboardMetrics?.demandLevel || topCrop?.marketData?.demandLevel,
      change: currentFarm?.dashboardMetrics?.demandChange || "+0%",
      trend: "up",
      icon: TrendingUp,
      color: "violet",
      subtitle: "Current market"
    },
    {
      title: "Risk Rating",
      value: currentFarm?.dashboardMetrics?.riskLevel || topCrop?.marketData?.riskLevel,
      change: currentFarm?.dashboardMetrics?.riskChange || "Moderate",
      trend: "neutral",
      icon: Shield,
      color: currentFarm?.dashboardMetrics?.riskLevel === 'Low' ? "green" : "amber",
      subtitle: "Investment safety"
    },
    {
      title: "Recommendation Score",
      value: `${Math.round(cropConfidence)}%`,
      change: "Real Time",
      trend: "neutral",
      icon: Target,
      color: "blue",
      subtitle: "AI Confidence"
    },
    {
      title: "Health Score",
      value: `${currentFarm?.dashboardMetrics?.healthScore || 70}%`,
      change: "Real Time",
      trend: "neutral",
      icon: Leaf,
      color: "green",
      subtitle: "Farm condition & weather"
    },
    {
      title: "Crops Analyzed",
      value: currentFarm?.dashboardMetrics?.cropsAnalyzed?.toString() || "15",
      change: "Real Time",
      trend: "neutral",
      icon: Sprout,
      color: "rose",
      subtitle: "ML Intelligence"
    },
  ] : [
    {
      title: "Estimated Profit",
      value: "Loading...",
      change: "",
      trend: "neutral" as const,
      icon: DollarSign,
      color: "emerald",
      subtitle: "Submit farm input first"
    },
    {
      title: "Crop Recommendation",
      value: "--",
      change: "",
      trend: "neutral" as const,
      icon: Wheat,
      color: "amber",
      subtitle: "Awaiting analysis"
    },
    {
      title: "Weather",
      value: "--",
      change: "",
      trend: "neutral" as const,
      icon: Cloud,
      color: "blue",
      subtitle: "Awaiting location"
    },
    {
      title: "Alerts",
      value: "0",
      change: "",
      trend: "neutral" as const,
      icon: AlertTriangle,
      color: "rose",
      subtitle: "No data yet"
    },
    {
      title: "Market Price",
      value: "--",
      change: "",
      trend: "neutral" as const,
      icon: TrendingUp,
      color: "violet",
      subtitle: "Submit farm input"
    },
    {
      title: "Health Score",
      value: "--",
      change: "",
      trend: "neutral" as const,
      icon: Leaf,
      color: "green",
      subtitle: "Awaiting data"
    },
  ];

  // Dynamic alerts from weather and farm data
  const riskAlerts = (() => {
    const alerts: any[] = [];
    const weatherAlerts = currentFarm?.weather?.alerts || currentFarm?.dashboardMetrics?.insights || [];
    weatherAlerts.forEach((alert: string, idx: number) => {
      alerts.push({
        id: idx + 1,
        type: "warning",
        title: "Weather Alert",
        message: alert,
        time: "Just now",
        priority: "high"
      });
    });
    // Market-based alert
    if (topCrop?.marketData?.priceTrend === "Rising") {
      alerts.push({
        id: alerts.length + 1,
        type: "success",
        title: "Market Opportunity",
        message: `${topCrop.name} prices are trending up. Consider selling now for best returns.`,
        time: "Today",
        priority: "medium"
      });
    }
    // Crop risk alert
    if (topCrop?.marketData?.riskLevel === "High") {
      alerts.push({
        id: alerts.length + 1,
        type: "warning",
        title: "Crop Risk Alert",
        message: `${topCrop.name} has high investment risk. Consider diversifying crops.`,
        time: "Today",
        priority: "high"
      });
    }
    if (alerts.length === 0) {
      alerts.push({
        id: 1,
        type: "info",
        title: "All Clear",
        message: "No active alerts. Your farm conditions look good!",
        time: "Now",
        priority: "low"
      });
    }
    return alerts;
  })();

  // Dynamic activities from farm data
  const activities = [
    {
      id: 1,
      action: `Analysis completed for ${currentFarm?.location || 'your farm'}`,
      detail: `${topCrop?.name || 'Crop'} recommended with ${Math.round(cropConfidence)}% confidence`,
      time: currentFarm?.createdAt ? new Date(currentFarm.createdAt).toLocaleDateString() : "Recently",
      icon: Wheat,
      color: "emerald"
    },
    {
      id: 2,
      action: `Weather sync for ${currentFarm?.location || 'location'}`,
      detail: `${currentFarm?.weather?.climate || 'N/A'} — ${currentFarm?.weather?.temp || 'N/A'}°C, Rain: ${currentFarm?.weather?.rain || 'N/A'}mm`,
      time: "On load",
      icon: Cloud,
      color: "blue"
    },
    {
      id: 3,
      action: `Soil type: ${currentFarm?.soilType || 'N/A'}`,
      detail: `Season: ${currentFarm?.season || 'N/A'} | Area: ${currentFarm?.area || 'N/A'} acres`,
      time: "Farm profile",
      icon: Layers,
      color: "amber"
    },
    {
      id: 4,
      action: "Market data updated",
      detail: `${topCrop?.name || 'Crop'} profit: ₹${topCrop?.marketData?.avgProfitPerAcre?.toLocaleString() || 'N/A'}/acre | Demand: ${topCrop?.marketData?.demandLevel || 'N/A'}`,
      time: "Live",
      icon: DollarSign,
      color: "violet"
    },
  ];

  // Dynamic AI recommendations based on user's farm
  const aiRecommendations = [
    {
      id: 1,
      title: `Optimal ${topCrop?.name || 'Crop'} Strategy`,
      description: `Based on ${currentFarm?.weather?.climate || 'current'} weather in ${currentFarm?.location || 'your area'}, ${topCrop?.name || 'your crop'} shows ${Math.round(cropConfidence)}% suitability. ${Number(currentFarm?.weather?.rain) > 50 ? 'Heavy rain expected — delay pesticide application.' : 'Conditions are suitable for normal farming operations.'}`,
      impact: "high",
      category: "Timing"
    },
    {
      id: 2,
      title: "Fertilizer Recommendation",
      description: `For ${currentFarm?.soilType || 'your soil'} soil in ${currentFarm?.season || 'this'} season, use ${recommendations.fertilizer}. ${currentFarm?.soilType === 'Sandy' ? 'Sandy soil needs more frequent fertilization.' : 'Apply based on soil test results.'}`,
      impact: "medium",
      category: "Resource"
    },
    {
      id: 3,
      title: "Market Timing",
      description: `${topCrop?.name || 'Your crop'} demand is ${topCrop?.marketData?.demandLevel || 'N/A'} with ${topCrop?.marketData?.priceTrend || 'stable'} price trend. Estimated profit: ₹${((topCrop?.marketData?.avgProfitPerAcre || 0) * (currentFarm?.area || 1)).toLocaleString()} total.`,
      impact: "high",
      category: "Market"
    },
    {
      id: 4,
      title: "Pest Management",
      description: `For ${topCrop?.name || 'your crop'}, recommended pesticide: ${recommendations.pesticide}. ${Number(currentFarm?.weather?.humidity) > 80 ? 'High humidity detected — watch for fungal infections.' : 'Monitor regularly for early pest signs.'}`,
      impact: "medium",
      category: "Protection"
    },
  ];

  const govtSchemes = [
    {
      name: "PM-KISAN (प्रधानमंत्री किसान सम्मान निधि)",
      description: "Provides ₹6000 yearly income support to farmers in three installments.",
      link: "https://pmkisan.gov.in"
    },
    {
      name: "Pradhan Mantri Fasal Bima Yojana (प्रधानमंत्री फसल बीमा योजना)",
      description: "Crop insurance scheme protecting farmers from natural disasters and crop loss.",
      link: "https://pmfby.gov.in"
    },
    {
      name: "PM Krishi Sinchai Yojana (प्रधानमंत्री कृषि सिंचाई योजना)",
      description: "Promotes irrigation and efficient water use for agriculture.",
      link: "https://pmksy.gov.in"
    },
    {
      name: "Soil Health Card Scheme (मृदा स्वास्थ्य कार्ड)",
      description: "Provides soil nutrient status and fertilizer recommendations to farmers.",
      link: "https://soilhealth.dac.gov.in"
    },
    {
      name: "Kisan Credit Card (किसान क्रेडिट कार्ड)",
      description: "Provides affordable credit to farmers for crop production.",
      link: "https://www.myscheme.gov.in/schemes/kcc"
    }
  ];



  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-300 text-black px-1 rounded">$1</mark>');
  };

  const filterSearchResults = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase().trim();
    if (!lowerQuery) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const results: any[] = [];

    // Filter Metrics
    const metricMatches = metricCards.filter((card: any) =>
      card.title.toLowerCase().includes(lowerQuery) ||
      card.subtitle.toLowerCase().includes(lowerQuery) ||
      card.value.toLowerCase().includes(lowerQuery)
    );
    if (metricMatches.length > 0) {
      results.push({
        category: 'Metrics',
        items: metricMatches.map(card => ({
          title: card.title,
          subtitle: card.subtitle,
          action: () => scrollToSection('metrics')
        }))
      });
    }

    // Filter Risk Alerts
    const alertMatches = riskAlerts.filter((alert: any) =>
      alert.title.toLowerCase().includes(lowerQuery) ||
      alert.message.toLowerCase().includes(lowerQuery)
    );
    if (alertMatches.length > 0) {
      results.push({
        category: 'Alerts',
        items: alertMatches.map(alert => ({
          title: alert.title,
          subtitle: alert.message.substring(0, 80) + '...',
          action: () => scrollToSection('alerts')
        }))
      });
    }

    // Filter AI Recommendations
    const recMatches = aiRecommendations.filter((rec: any) =>
      rec.title.toLowerCase().includes(lowerQuery) ||
      rec.description.toLowerCase().includes(lowerQuery)
    );
    if (recMatches.length > 0) {
      results.push({
        category: 'AI Recommendations',
        items: recMatches.map(rec => ({
          title: rec.title,
          subtitle: rec.description.substring(0, 80) + '...',
          action: () => scrollToSection('recommendations')
        }))
      });
    }

    // Filter Government Schemes
    const schemeMatches = govtSchemes.filter((scheme: any) =>
      scheme.name.toLowerCase().includes(lowerQuery) ||
      scheme.description.toLowerCase().includes(lowerQuery)
    );
    if (schemeMatches.length > 0) {
      results.push({
        category: 'Government Schemes',
        items: schemeMatches.map(scheme => ({
          title: scheme.name,
          subtitle: scheme.description.substring(0, 80) + '...',
          action: () => scrollToSection('schemes'),
          url: scheme.link
        }))
      });
    }

    // Filter Activities
    const activityMatches = activities.filter((activity: any) =>
      activity.action.toLowerCase().includes(lowerQuery) ||
      activity.detail.toLowerCase().includes(lowerQuery)
    );
    if (activityMatches.length > 0) {
      results.push({
        category: 'Recent Activities',
        items: activityMatches.map(activity => ({
          title: activity.action,
          subtitle: activity.detail.substring(0, 80) + '...',
          action: () => scrollToSection('activity')
        }))
      });
    }

    setSearchResults(results);
    setShowSearchResults(results.length > 0);
  }, [metricCards, riskAlerts, aiRecommendations, govtSchemes, activities]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    if (value.trim()) {
      const timeout = setTimeout(() => {
        filterSearchResults(value);
      }, 250);
      setSearchTimeout(timeout);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchTimeout, filterSearchResults]);

  // Fetch farms data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchFarms = async () => {
      try {
        console.log("Dashboard stateData:", stateData); // Task 6: Debug
        setLoading(true);
        const response = await farmsAPI.getMyFarms();
        const farmList: FarmData[] = response.data || [];
        setFarms(farmList);

        // Task 1,3: Prioritize state data (new input) OR use first farm
        if (stateData && Object.keys(stateData).length > 0) {
  // 🔥 NEW INPUT DATA (highest priority)
  setCurrentFarm(stateData);
  console.log("Using stateData:", stateData);
} 
else if (farmList.length > 0) {
  // 🔥 USE LATEST FARM (not first)
  const latestFarm = farmList[farmList.length - 1];
  setCurrentFarm(latestFarm);
  console.log("Using latest farm:", latestFarm);
} 
else {
  navigate("/input");

          return;
        }
      } catch (err: any) {
        setFetchError(err.response?.data?.message || "Failed to fetch farm data");
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, []);

  // Sync local state from currentFarm
  useEffect(() => {
    if (currentFarm) {
      setFarmLocation(currentFarm.location || "");
      setSoilType(currentFarm.soilType || "");
      setSeason(currentFarm.season || "");
    }
  }, [currentFarm]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    setChatMessages([
      ...chatMessages,
      { role: "user", message: inputMessage },
    ]);
    const msg = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await chatAPI.sendMessage({
        message: msg,
        context: currentFarm
      });
      const replyText = response.data.reply;
      setChatMessages((prev) => [
        ...prev,
        {
          role: "bot",
          message: replyText
        }
      ]);
      speakHindi(replyText, true);
    } catch (err: any) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "bot",
          message: err.response?.data?.message || "Sorry, I am having trouble connecting to the server. Please check your internet connection and try again."
        }
      ]);
      speakHindi(err.response?.data?.message || "Connection error", true);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const suggestions = [
    "Best fertilizer for rice?",
    "Weather forecast next week",
    "Market prices today",
    "Pest prevention tips"
  ];

  const navItems = [
    { icon: Home, label: "Dashboard", section: "overview" },
    { icon: BarChart3, label: "Analytics", section: "analytics" },
    { icon: Calendar, label: "Crop Calendar", section: "activity" },
    { icon: Bell, label: "Alerts", section: "alerts", badge: 3 },
    { icon: Gift, label: "Govt Schemes", section: "schemes" },
    { icon: Settings, label: "Settings", section: "metrics" },
    { icon: HelpCircle, label: "Help & Support", section: "activity" },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  // Refresh handler - reloads farm data
  const handleRefresh = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setFetchError("Please login to refresh data");
      return;
    }

    try {
      setRefreshLoading(true);
      setFetchError("");
      const response = await farmsAPI.getMyFarms();
      const farmList: FarmData[] = response.data || [];
      setFarms(farmList);

      if (farmList.length === 0) {
        navigate("/input");
        return;
      }

      setCurrentFarm(farmList[farmList.length - 1]);
    } catch (err: any) {
      setFetchError(err.response?.data?.message || "Failed to refresh farm data");
      console.error("Refresh error:", err);
    } finally {
      setRefreshLoading(false);
    }
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8,Farm Location,Soil Type,Season,Crop,Health Score,Risk Level\n" 
      + `${currentFarm?.location || 'Unknown'},${currentFarm?.soilType || 'Unknown'},${currentFarm?.season || 'Unknown'},${topCrop?.name || 'Unknown'},${recommendations.healthScore},${recommendations.riskLevel}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${currentFarm?.location || "farm"}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Chart data - Enterprise Grade Generator
  const topCrops = currentFarm?.recommendedCrops?.slice(0, 3) || [];
  
  const yieldData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, idx) => {
    const obj: any = { month };
    topCrops.forEach((c) => {
      const baseYield = (c.score || 0.5) * 5; 
      const variance = Math.sin((idx + 1) * 0.5) * 2;
      obj[c.name] = parseFloat(Math.max(0, baseYield + variance).toFixed(1));
    });
    return obj;
  });

  const rainfallData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, idx) => {
    const baseRain = parseFloat(currentFarm?.weather?.rain) || 45;
    const avg = baseRain + Math.sin(idx) * 20;
    const deterministicVariance = Math.cos(idx * 2) * 5;
    return { 
      month, 
      rainfall: parseFloat(Math.max(0, avg + deterministicVariance).toFixed(1)),
      avg: parseFloat(Math.max(0, avg).toFixed(1))
    };
  });

  const marketPriceData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => {
    const obj: any = { day };
    topCrops.forEach((c) => {
      const basePrice = (c.marketData?.avgProfitPerAcre / 10) || 3000;
      const deterministicVariance = Math.sin(idx) * 150;
      obj[c.name] = parseInt(Math.max(0, basePrice + deterministicVariance).toFixed(0));
    });
    return obj;
  });

  const cropDistribution = currentFarm?.recommendedCrops?.slice(0, 4).map((crop: any, idx: number) => ({
    name: crop.name,
    value: 100 - idx * 15,
    color: ['#059669', '#d97706', '#7c3aed', '#0891b2'][idx]
  })) || [
      { name: 'Rice', value: 45, color: '#059669' },
      { name: 'Wheat', value: 30, color: '#d97706' },
      { name: 'Cotton', value: 18, color: '#7c3aed' },
      { name: 'Vegetables', value: 7, color: '#0891b2' },
    ];
  
  

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50">
      {/* ============================================ */}
      {/* STICKY TOP HEADER */}
      {/* ============================================ */}
      <header className="bg-white border-b border-slate-200 shadow-sm z-50 flex-shrink-0">
        <div className="px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Menu + Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                  <Sprout className="w-5 h-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="font-bold text-slate-800 text-lg leading-tight">AgriVision</h1>
                  <p className="text-xs text-slate-500">Enterprise Farming Platform</p>
                </div>
              </div>
            </div>

            {/* Settings Modal */}
            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
              <DialogContent className="w-full max-w-md mx-4 rounded-xl shadow-2xl border border-slate-200 p-0 max-h-[90vh] overflow-y-auto">
                <DialogHeader className="p-6 border-b border-slate-200">
                  <DialogTitle className="text-2xl font-bold text-slate-900">Farm Settings</DialogTitle>
                  <DialogDescription className="text-slate-600">
                    Update your farm details. Changes will be saved to your account.
                  </DialogDescription>
                </DialogHeader>
                <div className="p-6 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="farmLocation" className="text-sm font-semibold text-slate-900">Farm Location</Label>
                    <Input
                      id="farmLocation"
                      value={farmLocation}
                      onChange={(e) => setFarmLocation(e.target.value)}
                      placeholder="Enter farm location"
                      className="rounded-xl border-slate-200 focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="soilType" className="text-sm font-semibold text-slate-900">Soil Type</Label>
                    <Select value={soilType} onValueChange={setSoilType}>
                      <SelectTrigger className="rounded-xl border-slate-200 focus:border-emerald-500">
                        <SelectValue placeholder="Select soil type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="Loamy">Loamy</SelectItem>
                        <SelectItem value="Clay">Clay</SelectItem>
                        <SelectItem value="Sandy">Sandy</SelectItem>
                        <SelectItem value="Red">Red</SelectItem>
                        <SelectItem value="Black">Black</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="season" className="text-sm font-semibold text-slate-900">Season</Label>
                    <Select value={season} onValueChange={setSeason}>
                      <SelectTrigger className="rounded-xl border-slate-200 focus:border-emerald-500">
                        <SelectValue placeholder="Select season" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="Kharif">Kharif</SelectItem>
                        <SelectItem value="Rabi">Rabi</SelectItem>
                        <SelectItem value="Zaid">Zaid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="p-6 border-t border-slate-200 bg-slate-50 rounded-b-xl">
                  <div className="flex w-full gap-3 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSettingsOpen(false)}
                      className="rounded-xl border-slate-200 hover:bg-slate-100 px-6"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={async () => {
                        if (currentFarm?._id && farmLocation && soilType && season) {
                          try {
                            await farmsAPI.update(currentFarm._id, {
                              location: farmLocation,
                              soilType,
                              season,
                            });
                            setSettingsOpen(false);
                            handleRefresh();
                          } catch (error) {
                            console.error("Failed to update farm:", error);
                          }
                        }
                      }}
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 font-semibold"
                    >
                      Save Changes
                    </Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Center: Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4 relative" ref={searchRef}>
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search metrics, alerts, schemes, recommendations..."
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-100 border border-transparent rounded-xl text-sm focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults([]);
                      setShowSearchResults(false);
                    }}
                    className="absolute right-10 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-500 hover:text-slate-700" />
                  </button>
                )}
                <button
                  onClick={() => setShowSearchResults(!showSearchResults)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-200 rounded-full transition-colors"
                  title="Toggle search results"
                >
                  <Filter className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {showSearchResults && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-2xl mt-2 max-h-96 overflow-y-auto z-50"
                  >
                    <div className="p-4 border-b border-slate-200 sticky top-0 bg-white/80 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-slate-900">
                          {searchResults.length} {searchResults.length === 1 ? 'Result' : 'Results'} for "{searchQuery}"
                        </h4>
                        <button
                          onClick={() => setShowSearchResults(false)}
                          className="text-slate-500 hover:text-slate-700 p-1 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-xs text-slate-500">
                        Press ↑↓ to navigate, Enter to select
                      </div>
                    </div>

                    {searchResults.map((category, catIdx) => (
                      <div key={catIdx} className="border-t border-slate-100 first:border-t-0">
                        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 font-medium text-sm text-slate-700 uppercase tracking-wide">
                          {category.category} ({category.items.length})
                        </div>
                        {category.items.slice(0, 3).map((item: any, idx: number) => (
                          <motion.button
                            key={idx}
                            className="w-full text-left p-4 hover:bg-emerald-50 border-b border-slate-50 last:border-b-0 transition-colors flex items-start gap-3 group"
                            onClick={item.action}
                          >
                            <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="flex-1 min-w-0">
                              <div
                                className="font-medium text-slate-900 mb-1 leading-tight"
                                dangerouslySetInnerHTML={{ __html: highlightText(item.title, searchQuery) }}
                              />
                              <div
                                className="text-sm text-slate-600 line-clamp-2"
                                dangerouslySetInnerHTML={{ __html: highlightText(item.subtitle, searchQuery) }}
                              />
                              {item.url && (
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-emerald-600 font-medium mt-1 inline-flex items-center gap-1 hover:underline"
                                >
                                  Visit site →
                                </a>
                              )}
                            </div>
                          </motion.button>
                        ))}
                        {category.items.length > 3 && (
                          <div className="px-4 pb-4 pt-2">
                            <button
                              onClick={category.action || category.items[0]?.action}
                              className="text-xs text-slate-500 hover:text-slate-900 font-medium w-full text-left transition-colors p-2 hover:bg-slate-100 rounded-lg"
                            >
                              Show all {category.items.length} {category.category.toLowerCase()}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}

                    {searchResults.length === 0 && (
                      <div className="p-8 text-center text-slate-500">
                        <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-sm font-medium mb-1">No results found</p>
                        <p className="text-xs">Try searching for "profit", "alert", "scheme", or "recommend"</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Actions + Profile */}
              <div className="flex items-center gap-2">
                <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2.5 rounded-lg hover:bg-slate-100 transition-colors relative">
                      <Bell className="w-5 h-5 text-slate-600" />
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80 p-2" align="end">
                    <div className="text-sm font-semibold text-slate-900 p-3 border-b border-slate-200 mb-2">Notifications</div>
                    <DropdownMenuItem className="p-3 cursor-pointer hover:bg-amber-50 border border-transparent hover:border-amber-200 rounded-lg mb-1 focus:bg-transparent">
                      <AlertCircleIcon className="w-4 h-4 text-amber-600 mr-3 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-slate-900">Weather advisory</div>
                        <div className="text-xs text-slate-500">Heavy rain expected in next 48hrs</div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-3 cursor-pointer hover:bg-green-50 border border-transparent hover:border-green-200 rounded-lg mb-1 focus:bg-transparent">
                      <AlertCircleIcon className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-slate-900">Pest alert</div>
                        <div className="text-xs text-slate-500">Aphids detected in Sector B</div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-3 cursor-pointer hover:bg-emerald-50 border border-transparent hover:border-emerald-200 rounded-lg mb-1 focus:bg-transparent">
                      <TrendingUp className="w-4 h-4 text-emerald-600 mr-3 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-slate-900">Market price update</div>
                        <div className="text-xs text-slate-500">Rice up 8% this week</div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-3 cursor-pointer hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded-lg focus:bg-transparent">
                      <Info className="w-4 h-4 text-blue-600 mr-3 flex-shrink-0" />
                      <div>
                        <div className="font-medium text-slate-900">Government scheme update</div>
                        <div className="text-xs text-slate-500">PM-KISAN installment available</div>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <button
                  onClick={handleRefresh}
                  disabled={refreshLoading || loading}
                  className="p-2.5 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-5 h-5 transition-all duration-200 ${refreshLoading
                    ? 'animate-spin text-emerald-600'
                    : 'text-slate-600 hover:rotate-12'
                    }`} />
                </button>
                
{/* Premium Profile Dropdown */}
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <div className="flex items-center gap-2 sm:gap-3 ml-1 sm:ml-2 pl-2 sm:pl-4 border-l border-slate-200 cursor-pointer group transition-all">

      {/* User Info */}
      <div className="hidden sm:block text-right leading-tight">
        <div className="text-sm font-semibold text-slate-800 group-hover:text-emerald-600 transition">
          {cleanName || "Farmer"}
        </div>

        <div className="text-xs text-slate-500">
          {(currentFarm?.location || "Farm Region").trim()}
        </div>
      </div>

      {/* Avatar */}
      <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 via-green-600 to-emerald-700 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-all duration-300">
        {cleanName ? cleanName.charAt(0).toUpperCase() : "F"}
      </div>

    </div>
  </DropdownMenuTrigger>

  <DropdownMenuContent
    align="end"
    className="w-72 p-2 rounded-2xl shadow-2xl border border-slate-200 bg-white/90 backdrop-blur-xl"
  >

    {/* Profile Header */}
    <div className="flex items-center gap-3 p-3 mb-2 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-200">

      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
        {cleanName ? cleanName.charAt(0).toUpperCase() : "F"}
      </div>

      <div>
        <div className="font-semibold text-slate-900 text-sm">
          {cleanName || "Farmer"}
        </div>

        <div className="text-xs text-slate-500">
          {(currentFarm?.location || "Farm Region").trim()}
        </div>
      </div>
    </div>

    {/* Menu Items */}

    <DropdownMenuItem
      onClick={() => scrollToSection("overview")}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 cursor-pointer transition"
    >
      <User className="w-4 h-4 text-emerald-600" />
      <span>View Profile</span>
    </DropdownMenuItem>

    <DropdownMenuItem
      onClick={() => scrollToSection("analytics")}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 cursor-pointer transition"
    >
      <Tractor className="w-4 h-4 text-blue-600" />
      <span>My Farms</span>
    </DropdownMenuItem>

    <DropdownMenuItem
      onClick={() => setSettingsOpen(true)}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 cursor-pointer transition"
    >
      <Settings className="w-4 h-4 text-purple-600" />
      <span>Settings</span>
    </DropdownMenuItem>

    <DropdownMenuItem
      onClick={() => setChatOpen(true)}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-amber-50 cursor-pointer transition"
    >
      <HelpCircle className="w-4 h-4 text-amber-600" />
      <span>Help & Support</span>
    </DropdownMenuItem>

    {/* Divider */}
    <div className="border-t border-slate-200 my-2"></div>

    {/* Logout */}
    <DropdownMenuItem
      onClick={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      }}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-rose-50 text-rose-600 cursor-pointer transition"
    >
      <LogOut className="w-4 h-4" />
      <span>Logout</span>
    </DropdownMenuItem>

  </DropdownMenuContent>
</DropdownMenu>
              </div>
          </div>
        </div>
      </header>

      {/* ============================================ */}
      {/* MAIN LAYOUT: SIDEBAR + CONTENT */}
      {/* ============================================ */}
      <div className="flex flex-1 overflow-hidden">
        {/* ============================================ */}
        {/* FIXED COLLAPSIBLE SIDEBAR */}
        {/* ============================================ */}
        <AnimatePresence mode="wait">
          {sidebarOpen && (
            <motion.aside
              initial={{ x: sidebarCollapsed ? -80 : -300 }}
              animate={{ x: 0 }}
              exit={{ x: sidebarCollapsed ? -80 : -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`${sidebarCollapsed ? "w-20" : "w-72"
                } bg-white border-r border-slate-200 flex-shrink-0 flex flex-col fixed lg:relative h-full z-40 transition-all duration-300`}
            >
              {/* Sidebar Header */}
              <div className="p-4 border-b border-slate-100 flex-shrink-0">
                <div className="flex items-center justify-between">
                  {!sidebarCollapsed && (
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 flex-1 mr-2 border border-emerald-100">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Farm Location</span>
                      </div>
                      <div className="text-base font-bold text-slate-900">{currentFarm?.location || stateData?.formData?.location || farmLocation || "Set Location"}</div>
                      <div className="text-xs text-slate-600 mt-1 flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">{currentFarm?.soilType || soilType || "--"} Soil</span>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">{currentFarm?.season || season || "--"}</span>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="bg-slate-100 hover:bg-slate-200 p-2 rounded-lg transition-colors flex-shrink-0"
                  >
                    {sidebarCollapsed ? (
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    ) : (
                      <ChevronLeft className="w-4 h-4 text-slate-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Stats in Sidebar */}
              {!sidebarCollapsed && (
                <div className="p-4 border-b border-slate-100">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                      <div className="text-lg font-bold text-slate-900">{farms.reduce((sum, f) => sum + (f.area || 0), 0)}</div>
                      <div className="text-xs text-slate-500">Total Acres</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                      <div className="text-lg font-bold text-slate-900">{farms.length}</div>
                      <div className="text-xs text-slate-500">My Farms</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {navItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToSection(item.section)}
                    className={`w-full flex items-center ${sidebarCollapsed ? "justify-center" : "justify-between"
                      } px-4 py-3 rounded-xl transition-all ${idx === 0
                        ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-600/25"
                        : "hover:bg-slate-100 text-slate-600"
                      }`}
                    title={sidebarCollapsed ? item.label : ""}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!sidebarCollapsed && <span className="font-medium text-sm">{item.label}</span>}
                    </div>
                    {!sidebarCollapsed && item.badge && (
                      <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>

              {/* Sidebar Footer */}
              {!sidebarCollapsed && (
                <div className="p-4 border-t border-slate-100">
                  <div className="bg-gradient-to-r from-emerald-600 to-green-700 rounded-xl p-4 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4" />
                      <span className="text-xs font-semibold">Premium Plan</span>
                    </div>
                    <p className="text-xs text-emerald-100 mb-3">Unlock AI predictions & advanced analytics</p>
                    <button className="w-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium py-2 rounded-lg transition-colors">
                      Upgrade Now
                    </button>
                  </div>
                </div>
              )}
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ============================================ */}
        {/* MAIN CONTENT AREA */}
        {/* ============================================ */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-4 lg:p-6 xl:p-8 pb-32">
            <div className="max-w-[1800px] mx-auto space-y-4 sm:space-y-6">

              {/* ============================================ */}
              {/* PAGE HEADER */}
              {/* ============================================ */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Farm Overview Dashboard</h1>
                  <p className="text-slate-500 mt-1 text-sm sm:text-base">Real-time analytics and insights for your agricultural operations</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                  <div className="text-right hidden sm:block">
                    <div className="text-sm font-medium text-slate-900">{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    <div className="text-xs text-slate-500">{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} • Last synced: 5 min ago</div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <button onClick={handleExport} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Export</span>
                    </button>
                    <button onClick={() => navigate("/input")} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 rounded-xl text-sm font-medium text-white hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/25">
                      <Plus className="w-4 h-4" />
                      <span>New Analysis</span>
                    </button>
                  </div>
                </div>
              </div>
      
              {/* ============================================ */}
              {/* FARM OVERVIEW PANEL */}
              {/* ============================================ */}
              <motion.div id="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-slate-800 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 min-w-0">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                        <Tractor className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h2 className="text-lg sm:text-xl font-bold truncate">{currentFarm?.location || farmLocation || "My Farm"}</h2>
                          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] sm:text-xs font-medium rounded-full border border-emerald-500/30 whitespace-nowrap">Active</span>
                          
                          {/* Hindi Voice Explanation Button */}
                          <button 
                            onClick={() => {
                              if (isReadingRecs) {
                                stopSpeaking();
                              } else {
                                const locationStr = currentFarm?.location || farmLocation || "Aapki location";
                                const soilStr = currentFarm?.soilType || soilType || "Aapki mitti";
                                const cropStr = recommendations.crop || "fasal";
                                const profit = currentFarm?.dashboardMetrics?.totalProfitEstimate?.toLocaleString() || '100000';
                                const riskStr = recommendations.riskLevel || "Low";
                                const demandStr = recommendations.marketDemand || "High";
                                
                                const speechText = `Aapne ${locationStr} location aur ${soilStr} mitti select ki hai. Iske liye sabse achhi fasal ${cropStr} hai. Isse aapko lagbhag ${profit} rupaye tak ka munafa ho sakta hai. Risk ${riskStr} hai aur market demand ${demandStr} hai.`;
                                speakHindi(speechText, false);
                              }
                            }}
                            className={`p-1.5 rounded-lg flex items-center justify-center transition-all shadow-md active:scale-95 ${isReadingRecs ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'}`}
                            title={isReadingRecs ? "Stop Voice" : "Speak Overview (Hindi)"}
                          >
                            {isReadingRecs ? <StopCircle className="w-4 h-4 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="text-slate-400 text-sm mb-3">Comprehensive farming analytics and AI-powered recommendations</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-1.5">
                            <Layers className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-300">{currentFarm?.soilType || soilType || "--"}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-300">{currentFarm?.season || season || "--"} {new Date().getFullYear()}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-300">{currentFarm?.location || farmLocation || "--"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row items-center justify-between sm:justify-start gap-4 sm:gap-6 xl:text-right w-full xl:w-auto bg-white/5 p-4 rounded-xl xl:bg-transparent xl:p-0">
                      <div className="text-center sm:text-left xl:text-center w-1/3 sm:w-auto">
                        <div className="text-xl sm:text-3xl font-bold text-emerald-400 truncate">{recommendations.healthScore}%</div>
                        <div className="text-[10px] sm:text-xs text-slate-400 whitespace-nowrap">Health</div>
                      </div>
                      <div className="w-px h-8 sm:h-12 bg-white/10"></div>
                      <div className="text-center sm:text-left xl:text-center w-1/3 sm:w-auto">
                        <div className="text-xl sm:text-3xl font-bold text-white truncate">{recommendations.riskLevel}</div>
                        <div className="text-[10px] sm:text-xs text-slate-400 whitespace-nowrap">Risk</div>
                      </div>
                      <div className="w-px h-8 sm:h-12 bg-white/10"></div>
                      <div className="text-center sm:text-left xl:text-center w-1/3 sm:w-auto">
                        <div className="text-xl sm:text-3xl font-bold text-amber-400 truncate" title={recommendations.crop}>{recommendations.crop}</div>
                        <div className="text-[10px] sm:text-xs text-slate-400 whitespace-nowrap">Crop</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ============================================ */}
              {/* KEY METRICS ROW - 6 CARDS */}
              {/* ============================================ */}
              <div id="metrics" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {metricCards.map((metric, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -2, boxShadow: "0 10px 40px -10px rgba(0,0,0,0.15)" }}
                    className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-lg transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2.5 rounded-xl bg-${metric.color}-50 border border-${metric.color}-100`}>
                        <metric.icon className={`w-5 h-5 text-${metric.color}-600`} />
                      </div>
                      <div className={`flex items-center gap-1 text-xs font-medium ${metric.trend === 'up' ? 'text-emerald-600' : metric.trend === 'down' ? 'text-rose-600' : 'text-slate-500'
                        }`}>
                        {metric.trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5" />}
                        {metric.trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5" />}
                        {metric.change}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-900 mb-1">{metric.value}</div>
                    <div className="text-sm font-medium text-slate-600 mb-1">{metric.title}</div>
                    <div className="text-xs text-slate-400">{metric.subtitle}</div>
                  </motion.div>
                ))}
              </div>

              {/* ============================================ */}
              {/* ANALYTICS CHARTS SECTION */}
              {/* ============================================ */}
              <div id="analytics" className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Yield Analytics Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="xl:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Crop Yield Analytics</h3>
                      <p className="text-sm text-slate-500">Monthly yield comparison across all crops (tons/acre)</p>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <select className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                        <option>Last 12 Months</option>
                        <option>Last 6 Months</option>
                        <option>This Year</option>
                      </select>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={yieldData}>
                      <defs>
                        <linearGradient id="riceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="wheatGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d97706" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                        }}
                      />
                      <Legend />
                      <Area type="monotone" dataKey={topCrops[0]?.name || "Crop 1"} name={topCrops[0]?.name || "Crop 1"} stroke="#059669" strokeWidth={2} fill="url(#riceGradient)" />
                      {topCrops[1] && <Area type="monotone" dataKey={topCrops[1].name} name={topCrops[1].name} stroke="#d97706" strokeWidth={2} fill="url(#wheatGradient)" />}
                      {topCrops[2] && <Bar dataKey={topCrops[2].name} name={topCrops[2].name} fill="#7c3aed" radius={[4, 4, 0, 0]} />}
                    </ComposedChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Crop Distribution */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
                >
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900">Crop Distribution</h3>
                    <p className="text-sm text-slate-500">Current season allocation</p>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={cropDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {cropDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3 mt-4">
                    {cropDistribution.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-sm text-slate-600">{item.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-900">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Rainfall & Market Price Charts */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Rainfall Analytics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Rainfall Analytics</h3>
                      <p className="text-sm text-slate-500">Monthly precipitation vs average (mm)</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm w-full sm:w-auto">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-slate-600">Actual</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                        <span className="text-slate-600">Average</span>
                      </div>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={rainfallData}>
                      <defs>
                        <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                        }}
                      />
                      <Area type="monotone" dataKey="rainfall" stroke="#3b82f6" strokeWidth={2} fill="url(#rainGradient)" />
                      <Line type="monotone" dataKey="avg" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Market Price Trends */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Market Price Trends</h3>
                      <p className="text-sm text-slate-500">Weekly price movement (₹/quintal)</p>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <Filter className="w-4 h-4 text-slate-500" />
                      </button>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={250}>
                    <RechartsLine data={marketPriceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} domain={[2000, 7500]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '12px',
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey={topCrops[0]?.name || "Crop 1"} name={topCrops[0]?.name || "Crop 1"} stroke="#059669" strokeWidth={2} dot={{ r: 4 }} />
                      {topCrops[1] && <Line type="monotone" dataKey={topCrops[1].name} name={topCrops[1].name} stroke="#d97706" strokeWidth={2} dot={{ r: 4 }} />}
                      {topCrops[2] && <Line type="monotone" dataKey={topCrops[2].name} name={topCrops[2].name} stroke="#7c3aed" strokeWidth={2} dot={{ r: 4 }} />}
                    </RechartsLine>
                  </ResponsiveContainer>
                </motion.div>
              </div>

              {/* ============================================ */}
              {/* AI RECOMMENDATIONS PANEL - DARK & MODERN */}
              {/* ============================================ */}
              <motion.div id="recommendations"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 shadow-2xl relative overflow-hidden"
              >
                {/* Animated Background Elements */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <motion.div
                          className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full"
                          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        ></motion.div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">AI Recommendations</h3>
                        <p className="text-sm text-slate-400">Intelligence powered insights for your farm</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                        <motion.span
                          className="w-2 h-2 bg-emerald-400 rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        ></motion.span>
                        Live Analysis
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiRecommendations.map((rec, idx) => (
                      <motion.div
                        key={rec.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + idx * 0.1 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        className="group bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700 hover:border-emerald-500/50 transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${rec.impact === 'high'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              }`}>
                              {rec.impact === 'high' ? 'High Impact' : 'Medium Impact'}
                            </span>
                            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-700 text-slate-300 border border-slate-600">
                              {rec.category}
                            </span>
                          </div>
                          <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                        </div>
                        <h4 className="text-base font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">{rec.title}</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">{rec.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div id="schemes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Government Schemes</h3>
                    <p className="text-sm text-slate-500">Key agriculture schemes and benefits for farmers</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-emerald-600 font-medium bg-emerald-100 px-2 py-1 rounded-full">5 Active</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {govtSchemes.map((scheme, idx) => (
                    <motion.div
                      key={scheme.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + idx * 0.05 }}
                      whileHover={{ y: -4, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.15)" }}
                      className="group bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all overflow-hidden relative"
                    >
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                        Active
                      </div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-200 group-hover:bg-emerald-200 transition-colors">
                          <Gift className="w-5 h-5 text-emerald-600" />
                        </div>
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">{scheme.name}</h4>
                      <p className="text-slate-600 mb-4 leading-relaxed">{scheme.description}</p>
                      <div className="flex items-center gap-2">
                        <a
                          href={scheme.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-medium py-2.5 px-4 rounded-lg text-sm transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                        >
                          <Award className="w-4 h-4" />
                          Learn More
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* ============================================ */}
              {/* RISK & ALERTS SECTION */}
              {/* ============================================ */}
              <div id="alerts" className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Alerts List */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="xl:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Risk & Alerts</h3>
                      <p className="text-sm text-slate-500">Active notifications requiring attention</p>
                    </div>
                    <button className="text-emerald-600 font-medium text-sm hover:text-emerald-700 transition-colors w-full sm:w-auto text-left sm:text-right">
                      View All Alerts
                    </button>
                  </div>
                  <div className="space-y-4">
                    {riskAlerts.map((alert, idx) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + idx * 0.1 }}
                        className={`flex items-start gap-4 p-4 rounded-xl border transition-all hover:shadow-md ${alert.type === 'warning'
                          ? 'bg-amber-50 border-amber-200 hover:border-amber-300'
                          : alert.type === 'success'
                            ? 'bg-emerald-50 border-emerald-200 hover:border-emerald-300'
                            : alert.type === 'info'
                              ? 'bg-blue-50 border-blue-200 hover:border-blue-300'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                      >
                        <div className={`p-2.5 rounded-xl flex-shrink-0 ${alert.type === 'warning'
                          ? 'bg-amber-500 text-white'
                          : alert.type === 'success'
                            ? 'bg-emerald-500 text-white'
                            : alert.type === 'info'
                              ? 'bg-blue-500 text-white'
                              : 'bg-slate-500 text-white'
                          }`}>
                          {alert.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
                          {alert.type === 'success' && <TrendingUp className="w-5 h-5" />}
                          {alert.type === 'info' && <Info className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-slate-900">{alert.title}</h4>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${alert.priority === 'high'
                              ? 'bg-rose-100 text-rose-700'
                              : alert.priority === 'medium'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-slate-100 text-slate-700'
                              }`}>
                              {alert.priority}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600">{alert.message}</p>
                          <span className="text-xs text-slate-400 mt-2 block">{alert.time}</span>
                        </div>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                          <MoreHorizontal className="w-4 h-4 text-slate-400" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Quick Actions & Weather */}
                <div className="space-y-6">
                  {/* Weather Widget */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Weather Forecast</h3>
                      <span className="text-xs text-blue-200">5-Day Outlook</span>
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-5xl font-bold">{recommendations.weather.temp}</div>
                      <div>
                        <div className="font-medium">{recommendations.weather.condition}</div>
                        <div className="text-sm text-blue-200">Humidity: {recommendations.weather.humidity}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-1 sm:gap-2 text-center">
                      {recommendations.weather.weeklyForecast.map(({day, temp, hasRain}: any) => (
                        <div key={day} className="bg-white/10 rounded-lg py-2 sm:py-3 px-1 sm:px-2">
                          <div className="text-xs text-blue-200 mb-1">{day}</div>
                          <div className="text-lg font-semibold">{temp}</div>
                          {hasRain ? (
                            <Droplets className="w-4 h-4 mx-auto mt-1 text-blue-200" />
                          ) : (
                            <Sun className="w-4 h-4 mx-auto mt-1 text-blue-200" />
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Quick Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65 }}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
                  >
                    <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors text-left">
                        <div className="p-2 bg-emerald-500 rounded-lg">
                          <Sprout className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">Request Analysis</div>
                          <div className="text-xs text-emerald-600">Get AI crop recommendations</div>
                        </div>
                      </button>
                      <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-left">
                        <div className="p-2 bg-blue-500 rounded-lg">
                          <Calendar className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">Schedule Irrigation</div>
                          <div className="text-xs text-blue-600">Plan water distribution</div>
                        </div>
                      </button>
                      <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors text-left">
                        <div className="p-2 bg-violet-500 rounded-lg">
                          <Package className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">Market Lookup</div>
                          <div className="text-xs text-violet-600">Check current prices</div>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* ============================================ */}
              {/* RECENT ACTIVITY TIMELINE */}
              {/* ============================================ */}
              <motion.div id="activity"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Recent Activity Timeline</h3>
                    <p className="text-sm text-slate-500">Latest farm operations and updates</p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                      <Filter className="w-4 h-4 text-slate-500" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                </div>
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-slate-200"></div>

                  <div className="space-y-6">
                    {activities.map((activity, idx) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.75 + idx * 0.1 }}
                        className="flex items-start gap-4 relative"
                      >
                        <div className={`relative z-10 w-11 h-11 rounded-xl flex items-center justify-center shadow-md ${activity.color === 'emerald' ? 'bg-emerald-500 text-white' :
                          activity.color === 'blue' ? 'bg-blue-500 text-white' :
                            activity.color === 'amber' ? 'bg-amber-500 text-white' :
                              activity.color === 'green' ? 'bg-green-500 text-white' :
                                'bg-violet-500 text-white'
                          }`}>
                          <activity.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-slate-900">{activity.action}</h4>
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {activity.time}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mt-0.5">{activity.detail}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button className="w-full py-3 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors flex items-center justify-center gap-2">
                    View All Activity
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>

            </div>
          </div>
        </main>
      </div>

      {/* ============================================ */}
      {/* PREMIUM AI CHATBOT UI UPGRADE */}
      {/* ============================================ */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 transition-all duration-300 max-w-[calc(100vw-32px)]" ref={chatRef}>
        <AnimatePresence>
          {!chatOpen ? (
            <motion.button
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 200 }}
              whileHover={{ scale: 1.05, translateY: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setChatOpen(true)}
              className="group relative flex items-center justify-center p-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 rounded-full blur-xl opacity-60 group-hover:opacity-100 group-hover:blur-2xl transition-all duration-500 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-emerald-900 via-emerald-700 to-teal-800 border border-emerald-400/30 text-white p-4 rounded-full shadow-2xl flex items-center gap-3 overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-full blur-xl mix-blend-overlay"></div>
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                >
                  <Sparkles className="w-8 h-8 text-emerald-300" />
                </motion.div>
                <div className="hidden sm:flex flex-col items-start pr-2">
                  <span className="font-bold text-lg leading-none tracking-wide text-white drop-shadow-md">AI Assistant</span>
                  <span className="text-[10px] text-emerald-200 font-medium">आपका स्मार्ट कृषि सहायक</span>
                </div>
              </div>
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.9, y: 30, filter: "blur(10px)" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.15)] w-[calc(100vw-32px)] sm:w-[26rem] md:w-[28rem] overflow-hidden border border-white/10 flex flex-col relative origin-bottom-right"
              style={{ maxHeight: '85vh' }}
            >
              {/* Background ambient glowing orbs */}
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl mix-blend-screen"></div>
                <div className="absolute bottom-40 -left-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl mix-blend-screen"></div>
              </div>

              {/* Chat Header */}
              <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 border-b border-white/5 text-white p-4 relative z-10">
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="bg-gradient-to-br from-emerald-400 to-teal-600 p-2.5 rounded-2xl shadow-lg border border-white/20">
                        <Sparkles className="w-5 h-5 text-white drop-shadow-md" />
                      </div>
                      <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border border-emerald-950"></span>
                      </span>
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base tracking-wide bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">AI Farming Assistant</h3>
                      <p className="text-[11px] text-emerald-300/80 font-medium">आपका स्मार्ट कृषि सहायक • Online</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isBotSpeaking && (
                      <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        type="button"
                        onClick={stopSpeaking}
                        className="bg-rose-500/10 hover:bg-rose-500/30 border border-rose-500/30 text-rose-200 p-1.5 px-3 rounded-full transition-all flex items-center gap-1.5 text-xs font-semibold backdrop-blur-md"
                        title="Stop Voice Output"
                      >
                        <StopCircle className="w-3.5 h-3.5 animate-pulse" />
                        <div>Stop</div>
                      </motion.button>
                    )}
                    <button
                      onClick={() => setChatOpen(false)}
                      className="hover:bg-white/10 p-2 rounded-xl transition-colors shrink-0 text-slate-300 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="h-[24rem] overflow-y-auto p-5 pb-2 space-y-6 relative z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {chatMessages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                    <Sprout className="w-12 h-12 text-emerald-500/50 mb-3" />
                    <p className="text-slate-400 text-sm">Start a conversation with your AI</p>
                  </div>
                )}
                {chatMessages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "bot" && (
                      <div className="bg-slate-800/80 p-2 rounded-full mr-3 h-8 w-8 flex-shrink-0 shadow-lg border border-white/5 flex items-center justify-center mt-1">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] p-3.5 text-sm leading-relaxed shadow-lg ${msg.role === "user"
                        ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl rounded-tr-sm"
                        : "bg-white/5 backdrop-blur-md text-slate-200 border border-white/10 rounded-2xl rounded-tl-sm"
                        }`}
                    >
                      {msg.message}
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start items-end"
                  >
                    <div className="bg-slate-800/80 p-2 rounded-full mr-3 h-8 w-8 flex-shrink-0 shadow-lg border border-white/5 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl rounded-tl-sm border border-white/10 shadow-lg">
                      <div className="flex gap-1.5 items-center h-4">
                        <motion.div className="w-2 h-2 bg-emerald-400/80 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                        <motion.div className="w-2 h-2 bg-emerald-500/80 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.15 }} />
                        <motion.div className="w-2 h-2 bg-teal-500/80 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }} />
                      </div>
                    </div>
                  </motion.div>
                )}
                {/* Auto-scroll anchor point */}
                <div ref={(el) => { if (el) { setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50) } }} />
              </div>

              {/* Quick Suggestions */}
              {suggestions.length > 0 && (
                <div className="px-5 py-2.5 relative z-10 bg-slate-900/50 backdrop-blur-sm">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x">
                    {suggestions.map((suggestion, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="bg-white/5 hover:bg-emerald-500/20 text-emerald-100/90 text-[11px] font-medium px-4 py-2 rounded-full whitespace-nowrap transition-all border border-white/10 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] snap-start shrink-0"
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Input Floating Pill */}
              <div className="p-4 relative z-10 pb-5">
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-2 p-1.5 bg-black/40 backdrop-blur-xl rounded-full border border-white/10 shadow-inner"
                >
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`ml-1 p-2.5 rounded-full transition-all shrink-0 ${isListening ? 'bg-rose-500/20 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse' : 'hover:bg-white/10 text-slate-400 hover:text-emerald-300'}`}
                    title={isListening ? "Listening... (Click to stop)" : "Speak in Hindi"}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={isListening ? "AI सुन रहा है..." : "कुछ भी पूछें (Speak or type...)"}
                    className="flex-1 min-w-0 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none px-2 py-2"
                  />
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className={`mr-1 p-2.5 rounded-full transition-all shrink-0 flex items-center justify-center ${inputMessage.trim() ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40" : "bg-white/5 text-slate-500"}`}
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { MapPin, Layers, Calendar, Sprout, LogOut, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { farmsAPI } from "../services/api";

export function FarmerInput() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [area, setArea] = useState("");
  const [soilType, setSoilType] = useState("");
  const [season, setSeason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const farmData = {
        location: location.trim(),
        area: parseFloat(area),
        soilType,
        season,
      };
      
      // Create farm and get the FULL response with weather + crops + metrics
      const response = await farmsAPI.create(farmData);
      const savedFarm = response.data?.farmData;
      
      // Navigate to results with the COMPLETE farm data (not raw form data)
      navigate("/results", { state: savedFarm || {} });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save farm data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 py-8 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-3 rounded-xl shadow-lg">
              <Sprout className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Smart Farmer
              </h1>
              <p className="text-sm text-emerald-200">Decision Support System</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors rounded-xl border border-white/20"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-3">
              Farm Information
            </h2>
            <p className="text-gray-600">
              Tell us about your farm to get personalized recommendations
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <label className="block text-gray-700 mb-2 flex items-center gap-2 font-medium">
                <div className="bg-emerald-100 p-1.5 rounded-lg">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                </div>
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your city or region"
                className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                e.g., Delhi, Mumbai, Punjab, Kerala
              </p>
            </motion.div>

            {/* Area Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <label className="block text-gray-700 mb-2 flex items-center gap-2 font-medium">
                <div className="bg-emerald-100 p-1.5 rounded-lg">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                </div>
                Farm Size (Acres)
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Enter farm size in acres"
                className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                required
              />
            </motion.div>

            {/* Soil Type Dropdown */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <label className="block text-gray-700 mb-2 flex items-center gap-2 font-medium">
                <div className="bg-emerald-100 p-1.5 rounded-lg">
                  <Layers className="w-4 h-4 text-emerald-600" />
                </div>
                Soil Type
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                required
              >
                <option value="">Select soil type</option>
                <option value="Alluvial">Alluvial Soil</option>
                <option value="Black (Regur)">Black (Regur) Soil</option>
                <option value="Red Soil">Red Soil</option>
                <option value="Loamy">Loamy Soil</option>
                <option value="Clay">Clay Soil</option>
                <option value="Sandy">Sandy Soil</option>
                <option value="Laterite">Laterite Soil</option>
              </select>
            </motion.div>

            {/* Season Dropdown */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <label className="block text-gray-700 mb-2 flex items-center gap-2 font-medium">
                <div className="bg-emerald-100 p-1.5 rounded-lg">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                </div>
                Season
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                required
              >
                <option value="">Select season</option>
                <option value="Kharif">Kharif (Monsoon — June to October)</option>
                <option value="Rabi">Rabi (Winter — November to March)</option>
                <option value="Zaid">Zaid (Summer — March to June)</option>
                <option value="Perennial">Perennial (Year-round)</option>
              </select>
            </motion.div>

            {error && (
              <div className="p-3 bg-rose-100 border border-rose-200 text-rose-800 rounded-xl text-sm">
                {error}
              </div>
            )}
            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              disabled={loading}
              whileHover={loading ? {} : { scale: 1.02 }}
              whileTap={loading ? {} : { scale: 0.98 }}
              type="submit"
              className={`w-full py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 ${
                loading 
                  ? 'bg-gray-500 cursor-not-allowed text-white/70' 
                  : 'bg-gradient-to-r from-emerald-600 to-green-600 text-white'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Weather & Crops...
                </>
              ) : (
                <>
                  Get Recommendations
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    →
                  </motion.div>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-6 bg-emerald-500/10 backdrop-blur-md rounded-2xl p-6 border border-emerald-400/20"
        >
          <div className="flex items-start gap-3">
            <div className="bg-emerald-500/20 p-2 rounded-lg flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            </div>
            <p className="text-emerald-100 text-sm">
              Our AI analyzes real-time weather from OpenWeatherMap, market trends, and soil conditions to provide the best crop recommendations tailored specifically for your farm
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
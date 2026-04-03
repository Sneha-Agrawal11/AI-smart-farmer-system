import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { 
  Sprout, 
  TrendingUp, 
  Cloud, 
  Shield, 
  Brain,
  Leaf,
  Target,
  BarChart3,
  Users,
  Award,
  CheckCircle2,
  ArrowRight,
  Zap,
  LineChart,
  Database,
  Bell,
  MessageSquare,
  ChevronRight,
  Globe,
  Sparkles,
  Phone,
  Mail
} from "lucide-react";

export function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: TrendingUp,
      title: "Profit Prediction",
      description: "AI-powered profit forecasting based on market trends and crop analysis",
      gradient: "from-emerald-500 to-green-600",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600"
    },
    {
      icon: Cloud,
      title: "Weather Intelligence",
      description: "Real-time weather tracking with precision forecasts for your region",
      gradient: "from-blue-500 to-cyan-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: Target,
      title: "Smart Crop Recommendation",
      description: "Personalized crop suggestions optimized for your soil and season",
      gradient: "from-purple-500 to-pink-600",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      icon: Leaf,
      title: "Pesticide & Fertilizer Advisory",
      description: "Expert recommendations for organic and chemical crop protection",
      gradient: "from-green-500 to-teal-600",
      iconBg: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: Shield,
      title: "Risk Analysis",
      description: "Comprehensive risk assessment to protect your investments",
      gradient: "from-amber-500 to-orange-600",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600"
    },
    {
      icon: MessageSquare,
      title: "AI Farming Assistant",
      description: "24/7 intelligent chatbot for instant farming guidance and support",
      gradient: "from-indigo-500 to-purple-600",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600"
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: "Maximize Profit",
      description: "Increase your farm revenue by up to 40% with data-driven crop selection and market timing",
      color: "emerald"
    },
    {
      icon: Shield,
      title: "Reduce Risk",
      description: "Minimize losses with predictive analytics, weather alerts, and comprehensive insurance guidance",
      color: "blue"
    },
    {
      icon: Brain,
      title: "Data-Driven Decisions",
      description: "Make informed choices backed by AI analysis of soil, weather, market, and historical data",
      color: "purple"
    }
  ];

  const stats = [
    { value: "50,000+", label: "Active Farmers", icon: Users },
    { value: "95%", label: "Success Rate", icon: Award },
    { value: "₹2.5Cr+", label: "Profits Generated", icon: TrendingUp },
    { value: "40%", label: "Avg Yield Increase", icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50">
      {/* Hero Section - KEEP EXACTLY THE SAME */}
      <div className="relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1725308283640-cf46e178bd02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGFncmljdWx0dXJlJTIwZmFybSUyMGZpZWxkJTIwYWVyaWFsfGVufDF8fHx8MTc3MzE0MDg4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Agriculture background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/80 via-emerald-800/70 to-emerald-900/90" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex justify-center mb-6">
                <div className="bg-emerald-500/20 backdrop-blur-sm p-4 rounded-full">
                  <Sprout className="w-16 h-16 text-emerald-200" />
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Smart Farmer Decision
                <br />
                Support System
              </h1>
              <p className="text-xl text-emerald-100 mb-12 max-w-2xl mx-auto">
                Empowering farmers with AI-driven insights for better crop
                decisions, maximum profits, and sustainable farming
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/login")}
                  className="px-8 py-4 bg-emerald-500 text-white rounded-xl font-semibold shadow-lg hover:bg-emerald-600 transition-colors"
                >
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/signup")}
                  className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-colors"
                >
                  Create Account
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-200/30 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-6 font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Powerful Features</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced AI technology meets traditional farming wisdom to bring you unparalleled insights
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all"></div>
                <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all">
                  <div className={`${feature.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className={`mt-6 inline-flex items-center gap-2 text-transparent bg-gradient-to-r ${feature.gradient} bg-clip-text font-semibold group-hover:gap-4 transition-all`}>
                    Learn more <ArrowRight className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-900 to-green-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-emerald-200 px-4 py-2 rounded-full mb-6 font-semibold border border-white/20">
              <Zap className="w-4 h-4" />
              <span>Simple Process</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
              Get started in three simple steps and transform your farming decisions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-400 -z-10 transform -translate-y-1/2"></div>

            {[
              {
                step: "01",
                icon: Database,
                title: "Enter Farm Details",
                description: "Share your farm location, soil type, and seasonal preferences through our intuitive form"
              },
              {
                step: "02",
                icon: Brain,
                title: "AI Data Analysis",
                description: "Our advanced AI processes weather patterns, market trends, and soil conditions instantly"
              },
              {
                step: "03",
                icon: Target,
                title: "Get Smart Recommendations",
                description: "Receive personalized crop suggestions, profit estimates, and actionable insights"
              }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="relative"
              >
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all group">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 text-white font-bold text-2xl mb-6 mx-auto shadow-lg group-hover:scale-110 transition-transform">
                    {step.step}
                  </div>
                  <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <step.icon className="w-8 h-8 text-emerald-200" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-center">
                    {step.title}
                  </h3>
                  <p className="text-emerald-100 text-center leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Benefits Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-6 font-semibold">
              <Award className="w-4 h-4" />
              <span>Platform Benefits</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Smart Farmer?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of farmers who have transformed their agricultural success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                whileHover={{ y: -10 }}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br from-${benefit.color}-500/20 to-${benefit.color}-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all`}></div>
                <div className="relative bg-white rounded-3xl p-10 shadow-xl border border-gray-100 hover:shadow-2xl transition-all">
                  <div className={`bg-gradient-to-br from-${benefit.color}-500 to-${benefit.color}-600 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <benefit.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Impact Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-emerald-900 text-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Trusted by Farmers Nationwide
            </h2>
            <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
              Our platform has helped thousands of farmers achieve remarkable results
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all group">
                  <stat.icon className="w-12 h-12 text-emerald-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                  <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-emerald-100 text-lg font-medium">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Strong CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/30">
              <Sparkles className="w-4 h-4" />
              <span className="font-semibold">Start Your Journey</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              Start Smart Farming Today
            </h2>
            <p className="text-2xl text-emerald-100 mb-12 max-w-2xl mx-auto">
              Join 50,000+ farmers who are already making data-driven decisions and maximizing their profits
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/signup")}
                className="px-10 py-5 bg-white text-emerald-600 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center gap-3 group"
              >
                Get Started Free
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="px-10 py-5 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
              >
                Sign In
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-emerald-500 p-2 rounded-lg">
                  <Sprout className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-xl">Smart Farmer</span>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering farmers with technology and data-driven insights.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  support@smartfarmer.gov.in
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  1800-XXX-XXXX
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Smart Farmer Decision Support System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { motion } from "motion/react";
import { Leaf, CloudRain, TrendingUp, ShieldAlert, Mic } from "lucide-react";

const features = [
  {
    title: "AI Crop Recommendation",
    description: "Get smart suggestions on what to plant based on your soil data, historical weather, and market trends.",
    icon: Leaf,
    color: "from-emerald-400 to-green-500",
    glow: "rgba(52,211,153,0.4)"
  },
  {
    title: "Weather Intelligence",
    description: "Hyper-local weather forecasting with predictive models to help you plan your farming operations.",
    icon: CloudRain,
    color: "from-blue-400 to-cyan-500",
    glow: "rgba(56,189,248,0.4)"
  },
  {
    title: "Market Price Prediction",
    description: "Stay ahead of the curve with AI-driven market trends and optimize when to sell your yield.",
    icon: TrendingUp,
    color: "from-amber-400 to-orange-500",
    glow: "rgba(251,191,36,0.4)"
  },
  {
    title: "Disease Detection",
    description: "Upload photos of your crops. Our computer vision models detect diseases instantly.",
    icon: ShieldAlert,
    color: "from-rose-400 to-red-500",
    glow: "rgba(244,63,94,0.4)"
  },
  {
    title: "Voice Assistant (Hindi Support)",
    description: "Interact with our platform using just your voice. Fully localized for ease of use in rural areas.",
    icon: Mic,
    color: "from-purple-400 to-indigo-500",
    glow: "rgba(168,85,247,0.4)"
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32 relative bg-zinc-950/50 overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background Radiance */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] bg-emerald-900/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold tracking-wider uppercase text-xs md:text-sm mb-6 shadow-[0_0_20px_rgba(52,211,153,0.15)]"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Next-Gen Capabilities
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight"
          >
            Intelligent Tools for <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 to-zinc-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              Modern Agriculture
            </span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.1, duration: 0.5, ease: "easeOut" }}
              className="group relative h-full flex"
            >
              {/* Glowing Border Background (only active on hover) */}
              <div 
                className="absolute -inset-[2px] bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 rounded-[2.2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none" 
              />
              <div 
                className="absolute -inset-[1px] bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 rounded-[2.2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
              />

              {/* Glassmorphic Card */}
              <div className="relative flex flex-col w-full h-full bg-zinc-900/40 backdrop-blur-3xl border border-white/[0.05] p-8 md:p-10 rounded-[2rem] overflow-hidden transition-transform duration-500 group-hover:-translate-y-2 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] group-hover:shadow-[0_20px_40px_0_rgba(16,185,129,0.2)] z-10">
                
                {/* Subtle internal gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />

                <div className="relative z-10">
                  <div 
                    className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-8 shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                    style={{ boxShadow: `0 10px 30px ${feature.glow}, inset 0 2px 4px rgba(255,255,255,0.3)` }}
                  >
                    <feature.icon className="w-7 h-7 md:w-8 md:h-8 text-white drop-shadow-md" />
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-300 group-hover:to-teal-300 transition-all duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-zinc-400 leading-relaxed text-sm md:text-base font-medium group-hover:text-zinc-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>

                {/* Decorative background element inside card */}
                <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-white/[0.02] rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-colors duration-700 pointer-events-none z-0" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
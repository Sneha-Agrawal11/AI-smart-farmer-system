import { motion, useScroll, useTransform } from "motion/react";
import { Link } from "react-router";
import { Leaf, Cpu, BarChart3, ChevronRight, Activity, Sparkles } from "lucide-react";
import { useMemo } from "react";

export function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 150]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -80]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  // Generate deterministic particles for hydration consistency
  const particles = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5
  })), []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-24 md:pt-24 md:pb-32 overflow-hidden bg-black selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background Enhancements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,78,59,0.8),transparent_70%)] mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1762278804884-5680cd6725a5?q=80&w=2000')] opacity-[0.15] bg-cover bg-center mix-blend-luminosity grayscale-[30%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/90 to-black" />
        
        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

        {/* Animated Glow Orbs with stronger intensity */}
        <motion.div
          animate={{ x: [-30, 30, -30], y: [-30, 30, -30] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] left-[10%] md:top-1/4 md:left-1/4 w-[20rem] h-[20rem] md:w-[40rem] md:h-[40rem] bg-emerald-500/25 rounded-full blur-[100px] md:blur-[140px]"
        />
        <motion.div
          animate={{ x: [30, -30, 30], y: [30, -30, 30] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[20%] right-[10%] md:bottom-1/4 md:right-1/4 w-[15rem] h-[15rem] md:w-[30rem] md:h-[30rem] bg-teal-500/25 rounded-full blur-[80px] md:blur-[120px]"
        />

        {/* Floating Particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: `${p.y}vh`, x: `${p.x}vw`, opacity: 0 }}
            animate={{ 
              y: [`${p.y}vh`, `${p.y - 20}vh`],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0.5]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "linear"
            }}
            className="absolute rounded-full bg-emerald-400/60 blur-[1px] shadow-[0_0_10px_rgba(52,211,153,0.8)]"
            style={{ width: p.size, height: p.size }}
          />
        ))}
      </div>

      <div className="max-w-7xl w-full mx-auto px-6 grid lg:grid-cols-2 gap-16 lg:gap-8 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: y1, opacity }}
          className="flex flex-col items-center lg:items-start text-center lg:text-left gap-8 mt-12 lg:mt-0"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:bg-white/[0.06] hover:border-emerald-500/30 transition-all duration-300"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="text-sm font-semibold text-emerald-300 tracking-wide">AgriVision 2.0 is Live</span>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-extrabold tracking-tight leading-[1.1] text-white">
            Smart Farming <br className="hidden sm:block" />
            <span className="relative inline-block mt-2 sm:mt-0">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 drop-shadow-[0_0_25px_rgba(52,211,153,0.6)]">
                Powered by AI
              </span>
              <span className="absolute inset-0 bg-emerald-400/20 blur-[30px] z-0" />
            </span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-300 max-w-2xl leading-relaxed font-medium">
            Transform your agricultural decisions with real-time insights, 
            <span className="text-emerald-300 font-semibold drop-shadow-[0_0_8px_rgba(110,231,183,0.5)]"> AI predictions</span>, 
            and smart analytics built for modern farms.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-4">
            <Link
              to="/signup"
              className="group relative w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 font-bold rounded-2xl transition-all duration-300 shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:shadow-[0_0_60px_rgba(16,185,129,0.7)] hover:-translate-y-1 overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-[150%] skew-x-[-20deg] group-hover:animate-[shine_1.5s_ease-in-out]" />
              <span className="relative z-10 flex items-center gap-2 text-lg">
                Get Started Free <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white/[0.03] hover:bg-white/[0.08] text-white font-semibold rounded-2xl backdrop-blur-xl border border-white/[0.08] transition-all hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(52,211,153,0.2)] text-lg"
            >
              Login to Dashboard
            </Link>
          </div>
        </motion.div>

        {/* Floating UI Elements - Fully Responsive */}
        <motion.div
          style={{ y: y2 }}
          className="relative w-full h-[450px] sm:h-[500px] lg:h-[600px] flex items-center justify-center lg:block mt-8 lg:mt-0 perspective-1000"
        >
          {/* Main central card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: 10, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0 }}
            transition={{ delay: 0.3, duration: 1, type: "spring", stiffness: 100 }}
            className="absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 w-[90%] max-w-[360px] p-6 rounded-[2rem] bg-zinc-900/60 backdrop-blur-3xl border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5),0_0_40px_rgba(16,185,129,0.15)] z-20 hover:border-emerald-500/40 transition-colors duration-500 group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex justify-between items-center mb-8">
              <h3 className="font-bold text-white flex items-center gap-3 text-lg">
                <div className="p-2 bg-emerald-500/20 rounded-lg drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
                  <Leaf className="w-5 h-5 text-emerald-400" />
                </div>
                Crop Health
              </h3>
              <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.2)]">
                Optimal
              </span>
            </div>
            <div className="space-y-6 relative z-10">
              {[
                { label: 'Soil Moisture', val: 85, color: 'from-blue-500 to-cyan-400' },
                { label: 'Nutrient Level', val: 92, color: 'from-emerald-500 to-teal-400' },
                { label: 'Sunlight', val: 78, color: 'from-amber-500 to-orange-400' }
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm font-medium text-zinc-300">
                    <span>{item.label}</span>
                    <span className="text-white">{item.val}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-black/60 rounded-full overflow-hidden shadow-inner border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.val}%` }}
                      transition={{ delay: 0.8 + i * 0.2, duration: 1.5, ease: "easeOut" }}
                      className={`h-full bg-gradient-to-r ${item.color} rounded-full relative`}
                    >
                      <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 blur-[2px]" />
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Floating Widget 1 */}
          <motion.div
            animate={{ y: [-15, 15, -15], x: [-5, 5, -5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 lg:top-20 lg:right-10 p-4 rounded-2xl bg-zinc-900/50 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex items-center gap-4 z-30 hover:bg-zinc-800/80 hover:border-blue-500/30 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <Cpu className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">AI Prediction</p>
              <p className="font-bold text-white text-lg">+24% Yield</p>
            </div>
          </motion.div>

          {/* Floating Widget 2 */}
          <motion.div
            animate={{ y: [15, -15, 15], x: [5, -5, 5] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-0 left-0 lg:bottom-20 lg:left-10 p-4 rounded-2xl bg-zinc-900/50 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex items-center gap-4 z-10 hover:bg-zinc-800/80 hover:border-amber-500/30 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <BarChart3 className="w-6 h-6 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Market Price</p>
              <p className="font-bold text-white text-lg flex items-center gap-1.5">
                Wheat <Activity className="w-4 h-4 text-emerald-400" />
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
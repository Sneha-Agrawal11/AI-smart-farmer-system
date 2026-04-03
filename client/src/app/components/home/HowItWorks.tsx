import { motion } from "motion/react";
import { Database, Cpu, Lightbulb } from "lucide-react";

const steps = [
  {
    icon: Database,
    title: "1. Enter Farm Details",
    description: "Input soil type, location, and historical data into our intuitive dashboard.",
  },
  {
    icon: Cpu,
    title: "2. AI Analyzes Data",
    description: "Our proprietary machine learning models process the data in real-time.",
  },
  {
    icon: Lightbulb,
    title: "3. Get Smart Insights",
    description: "Receive actionable recommendations on crops, weather, and yield optimization.",
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 relative bg-black selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background Radiance */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[40vw] h-[40vw] bg-emerald-900/15 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-0 left-1/4 w-[50vw] h-[50vw] bg-teal-900/10 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight"
          >
            How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.4)]">Works</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 max-w-2xl mx-auto text-lg md:text-xl font-medium"
          >
            A seamless flow from raw data to intelligent, profitable action.
          </motion.p>
        </div>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-16 md:gap-8 mt-12 md:mt-24">
          
          {/* Animated Connecting Line (Desktop) */}
          <div className="absolute top-[3rem] left-0 w-full h-[2px] bg-zinc-800/50 hidden md:block rounded-full z-0 overflow-hidden shadow-[0_0_10px_rgba(0,0,0,0.5)]">
            <motion.div
              initial={{ x: "-100%" }}
              whileInView={{ x: "100%" }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="h-full w-1/3 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_rgba(52,211,153,0.8)]"
            />
          </div>

          {/* Animated Connecting Line (Mobile) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-zinc-800/50 block md:hidden rounded-full z-0 overflow-hidden">
            <motion.div
              initial={{ y: "-100%" }}
              whileInView={{ y: "100%" }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-full h-1/3 bg-gradient-to-b from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_rgba(52,211,153,0.8)]"
            />
          </div>

          {/* Steps */}
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.2, duration: 0.6, type: "spring", stiffness: 100 }}
              className="relative z-10 flex flex-col items-center text-center w-full max-w-[320px] bg-zinc-950/40 md:bg-transparent backdrop-blur-md md:backdrop-blur-none p-6 md:p-0 rounded-[2rem] md:rounded-none border border-white/5 md:border-none shadow-2xl md:shadow-none"
            >
              <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center mb-6 md:mb-8 shadow-[0_0_40px_rgba(0,0,0,0.8)] group hover:border-emerald-500/60 hover:bg-zinc-800 transition-all duration-500 z-10">
                <div className="absolute inset-0 rounded-full bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                <step.icon className="w-10 h-10 md:w-12 md:h-12 text-emerald-400 group-hover:scale-110 group-hover:text-emerald-300 transition-transform duration-500 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4 group-hover:text-emerald-300 transition-colors">{step.title}</h3>
              <p className="text-zinc-400 leading-relaxed text-sm md:text-base font-medium">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
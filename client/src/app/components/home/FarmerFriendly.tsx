import { motion } from "motion/react";
import { Mic, Globe, Smartphone } from "lucide-react";

export function FarmerFriendly() {
  return (
    <section className="py-24 md:py-32 bg-zinc-950/80 relative overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 translate-x-1/4 w-[100vw] h-[100vw] lg:w-[60vw] lg:h-[60vw] bg-[radial-gradient(ellipse_at_center,rgba(6,78,59,0.4)_0%,transparent_60%)] pointer-events-none mix-blend-screen z-0" />
      
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative z-10">
        
        {/* Content Side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full lg:w-1/2 flex flex-col gap-6 md:gap-8 order-2 lg:order-1"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 font-semibold tracking-wider uppercase text-xs md:text-sm mb-6 shadow-[0_0_20px_rgba(20,184,166,0.15)]">
              Accessible Technology
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mt-2 leading-tight">
              Designed for <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                Every Farmer
              </span>
            </h2>
          </div>

          <p className="text-zinc-300 text-lg md:text-xl leading-relaxed font-medium">
            We believe technology should adapt to the user, not the other way around. AgriVision is built from the ground up to be accessible, intuitive, and truly helpful in the field.
          </p>

          <ul className="space-y-6 md:space-y-8 mt-4 md:mt-6">
            {[
              {
                icon: Globe,
                title: "Full Hindi Support",
                desc: "Navigate and use the entire platform in Hindi. More regional languages coming soon.",
                color: "text-blue-400",
                bg: "bg-blue-500/10 border-blue-500/20"
              },
              {
                icon: Mic,
                title: "Voice-Based Assistant",
                desc: "Don't like typing? Just talk to our AI assistant to get insights and record data.",
                color: "text-emerald-400",
                bg: "bg-emerald-500/10 border-emerald-500/20"
              },
              {
                icon: Smartphone,
                title: "Simple Mobile Interface",
                desc: "Large buttons, clear icons, and a layout that works flawlessly on any smartphone.",
                color: "text-purple-400",
                bg: "bg-purple-500/10 border-purple-500/20"
              }
            ].map((item, idx) => (
              <motion.li 
                key={idx} 
                className="flex gap-5 md:gap-6 items-start group"
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl ${item.bg} border flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-all duration-300`}>
                  <item.icon className={`w-6 h-6 md:w-7 md:h-7 ${item.color} drop-shadow-[0_0_8px_currentColor]`} />
                </div>
                <div>
                  <h4 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">{item.title}</h4>
                  <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-medium">{item.desc}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Visual / Image Side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
          whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 relative order-1 lg:order-2 perspective-1000"
        >
          <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] border border-white/[0.08] aspect-square md:aspect-[4/5] group transform-style-3d">
            <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors duration-700" />
            <img
              src="https://images.unsplash.com/photo-1693761934145-513a1d537341?q=80&w=1200"
              alt="Modern Farm Drone"
              className="object-cover w-full h-full opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />

            {/* Floating Glass Element */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 bg-zinc-900/60 backdrop-blur-2xl border border-white/20 p-6 md:p-8 rounded-[1.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-20 hover:border-emerald-500/50 transition-colors"
            >
              <div className="flex items-center gap-4 text-white mb-3">
                <div className="p-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                  <Mic className="text-emerald-400 w-6 h-6 md:w-7 md:h-7 animate-pulse drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                </div>
                <span className="font-bold text-lg md:text-xl tracking-wide">Voice Command Active</span>
              </div>
              <p className="text-zinc-300 text-sm md:text-base font-medium pl-1">"मुझे कल के मौसम की जानकारी दो"</p>
              <p className="text-zinc-500 text-xs md:text-sm mt-1 pl-1 italic">(Tell me tomorrow's weather)</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
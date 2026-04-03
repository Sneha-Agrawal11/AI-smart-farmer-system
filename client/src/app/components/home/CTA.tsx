import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 md:py-32 bg-black relative overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden p-10 md:p-20 text-center bg-zinc-900 border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]"
        >
          {/* Intense Background gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black z-0" />
          <div className="absolute top-0 right-0 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-emerald-500/30 blur-[100px] md:blur-[140px] -translate-y-1/2 translate-x-1/3 rounded-full pointer-events-none z-0" />
          <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-teal-500/20 blur-[100px] md:blur-[140px] translate-y-1/3 -translate-x-1/3 rounded-full pointer-events-none z-0" />
          
          {/* Noise overlay */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.1] text-zinc-300 font-semibold tracking-wider uppercase text-xs md:text-sm mb-8 shadow-inner backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Ready to Upgrade?
            </div>
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Start Your Smart <br className="hidden sm:block" /> Farming{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 drop-shadow-[0_0_20px_rgba(52,211,153,0.4)]">
                Journey
              </span>
            </h2>
            
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
              Join thousands of modern farmers leveraging AI to increase yield, reduce costs, and secure their future.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                to="/signup"
                className="group relative w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 font-bold rounded-2xl transition-all duration-300 shadow-[0_0_40px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.6)] hover:-translate-y-1 text-lg overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-[150%] skew-x-[-20deg] group-hover:animate-[shine_1.5s_ease-in-out]" />
                <span className="relative z-10 flex items-center gap-2">
                  Create Free Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
import { motion } from "motion/react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Wheat Farmer, Punjab",
    image: "https://images.unsplash.com/photo-1672140100988-7c5765a07aaf?q=80&w=400",
    text: "AgriVision's AI disease detection caught rust on my crops weeks before I would have noticed it myself. Saved my entire harvest.",
  },
  {
    name: "Sunita Devi",
    role: "Organic Vegetable Grower",
    image: "https://images.unsplash.com/photo-1614025000673-edf238aaf5d4?q=80&w=400",
    text: "The voice assistant in Hindi makes everything so simple. I just ask 'what should I plant next' and it gives me data-backed answers.",
  },
  {
    name: "Anil Patel",
    role: "Cotton Farmer, Gujarat",
    image: "https://images.unsplash.com/photo-1595956481935-a9e254951d49?q=80&w=400",
    text: "Market price predictions helped me hold my yield for an extra two weeks, resulting in a 15% increase in profits. Incredible tool.",
  }
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 md:py-32 bg-black relative selection:bg-emerald-500/30 selection:text-emerald-200 overflow-hidden">
      {/* Deep gradient background highlights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] md:w-full max-w-5xl h-[50vh] md:h-96 bg-gradient-to-r from-emerald-900/20 via-teal-900/20 to-emerald-900/20 blur-[100px] md:blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold tracking-wider uppercase text-xs md:text-sm mb-6 shadow-[0_0_20px_rgba(52,211,153,0.15)]"
          >
            Success Stories
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight"
          >
            Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.4)]">Farmers</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 max-w-2xl mx-auto text-lg md:text-xl font-medium"
          >
            Real stories from people who have transformed their farms with AI.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.15, duration: 0.6, ease: "easeOut" }}
              className="group relative flex flex-col p-8 md:p-10 rounded-[2rem] bg-zinc-900/40 backdrop-blur-2xl border border-white/[0.05] hover:bg-zinc-900/60 hover:border-emerald-500/50 transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)] hover:-translate-y-2"
            >
              {/* Internal glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10 flex-grow">
                <div className="flex gap-1 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-emerald-400 text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]" />
                  ))}
                </div>

                <p className="text-zinc-300 leading-relaxed text-lg mb-8 font-medium italic relative">
                  <span className="text-5xl absolute -top-6 -left-3 text-emerald-500/20 font-serif drop-shadow-md">"</span>
                  {t.text}
                </p>
              </div>

              <div className="relative z-10 flex items-center gap-5 pt-6 border-t border-white/10 group-hover:border-emerald-500/20 transition-colors">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-400 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
                  <img src={t.image} alt={t.name} className="relative w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-zinc-800 group-hover:border-emerald-400 transition-colors shadow-lg" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base md:text-lg">{t.name}</h4>
                  <p className="text-sm md:text-base text-zinc-500 font-medium">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
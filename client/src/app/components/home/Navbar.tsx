import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Leaf, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || mobileMenuOpen
            ? "bg-black/70 backdrop-blur-2xl border-b border-white/10 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group relative z-50" onClick={() => setMobileMenuOpen(false)}>
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.4)] group-hover:shadow-[0_0_30px_rgba(52,211,153,0.6)] transition-all duration-300 group-hover:scale-105">
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <Leaf className="text-zinc-950 w-5 h-5 stroke-[2.5] relative z-10" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Agri<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">Vision</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {["Features", "How it Works", "Testimonials"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-zinc-300 hover:text-emerald-400 transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-emerald-400 transition-all duration-300 group-hover:w-full rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-5">
            <Link to="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
              Login
            </Link>
            <Link
              to="/signup"
              className="relative text-sm font-semibold text-black bg-emerald-400 hover:bg-emerald-300 px-6 py-2.5 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_35px_rgba(52,211,153,0.6)] hover:scale-105 overflow-hidden group"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/40 to-white/0 -translate-x-[150%] skew-x-[-20deg] group-hover:animate-[shine_1.5s_ease-in-out]" />
              <span className="relative z-10">Get Started</span>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden relative z-50 text-zinc-300 hover:text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl pt-24 px-6 md:hidden flex flex-col"
          >
            <div className="flex flex-col gap-6 text-lg font-medium">
              {["Features", "How it Works", "Testimonials"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-zinc-300 hover:text-emerald-400 transition-colors py-2 border-b border-white/5"
                >
                  {item}
                </a>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-4">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors"
              >
                Login to Dashboard
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 font-bold shadow-[0_0_30px_rgba(52,211,153,0.4)]"
              >
                Get Started Free
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
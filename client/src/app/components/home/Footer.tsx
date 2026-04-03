import { Link } from "react-router";
import { Leaf, Twitter, Linkedin, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black py-16 border-t border-white/5 relative overflow-hidden z-10 selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Footer background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] max-w-2xl h-40 bg-emerald-900/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-16 mb-16">
          
          <div className="max-w-sm w-full">
            <Link to="/" className="flex items-center gap-3 group mb-6 relative z-50">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(52,211,153,0.5)]">
                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <Leaf className="text-zinc-950 w-5 h-5 stroke-[2.5] relative z-10" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Agri<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Vision</span>
              </span>
            </Link>
            
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-8 font-medium">
              Empowering farmers with artificial intelligence and modern technology to optimize yield, increase profits, and secure their future.
            </p>
            
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-emerald-400 hover:border-emerald-400/50 hover:bg-emerald-500/10 hover:-translate-y-1 transition-all duration-300">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-emerald-400 hover:border-emerald-400/50 hover:bg-emerald-500/10 hover:-translate-y-1 transition-all duration-300">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-emerald-400 hover:border-emerald-400/50 hover:bg-emerald-500/10 hover:-translate-y-1 transition-all duration-300">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 w-full lg:w-auto text-sm">
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Platform</h4>
              <ul className="space-y-4">
                {['Features', 'Pricing', 'Integration', 'API'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-zinc-400 hover:text-emerald-400 font-medium transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Resources</h4>
              <ul className="space-y-4">
                {['Documentation', 'Community', 'Blog', 'Support'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-zinc-400 hover:text-emerald-400 font-medium transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs">Company</h4>
              <ul className="space-y-4">
                {['About Us', 'Careers', 'Privacy Policy', 'Terms'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-zinc-400 hover:text-emerald-400 font-medium transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-zinc-500 text-sm font-medium text-center md:text-left">
            &copy; {new Date().getFullYear()} AgriVision Technologies. All rights reserved.
          </p>
          
          <div className="flex items-center gap-2 text-sm text-zinc-300 bg-white/[0.03] backdrop-blur-md px-5 py-2.5 rounded-full border border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
            <span>Developed by</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1.5 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]">
              Sneha Agrawal
              <span className="relative flex h-2 w-2 ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
              </span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
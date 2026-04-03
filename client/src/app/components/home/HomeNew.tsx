import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { Features } from "./Features";
import { HowItWorks } from "./HowItWorks";
import { FarmerFriendly } from "./FarmerFriendly";
import { Testimonials } from "./Testimonials";
import { CTA } from "./CTA";

export default function HomeNew() {
  return (
    <div className="relative min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Global Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/10 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-900/10 blur-[150px] rounded-full mix-blend-screen" />
        
        {/* Universal subtle noise overlay */}
        <div className="absolute inset-0 opacity-[0.025] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      </div>

      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <Features />
          <HowItWorks />
          <FarmerFriendly />
          <Testimonials />
          <CTA />
        </main>
        <Footer />
      </div>
    </div>
  );
}
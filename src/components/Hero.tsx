// Hero.tsx
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

// ---- Import all banner images ----
import heroBanner from "@/assets/hero-banner.jpg";
import banner from "@/assets/banner.jpg";
import banner1 from "@/assets/banner2.jpg";
import bannerPng from "@/assets/banner3.jpg";

const bannerImages = [heroBanner, banner, banner1, bannerPng];

const Hero = () => {
  const [currentIdx, setCurrentIdx] = useState(0);

  // ---- Auto-rotate every 5 seconds ----
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[70vh] w-full flex items-center justify-center overflow-hidden">
      {/* ---- Background Image (with fade transition) ---- */}
      <div className="absolute inset-0">
        {bannerImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
              idx === currentIdx ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${img})`,
            }}
          />
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 md:bg-black/40 backdrop-blur-[1px]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Left: Text & Buttons */}
          <div className="text-left space-y-5 max-w-xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight drop-shadow-lg">
              Eco-Friendly <span className="italic text-lime-200">Kitchenware</span>
              <br />
              for a greener home
            </h1>

            <p className="text-base sm:text-lg text-white/90">
              Upgrade your kitchen with sustainable, natural products designed
              for a cleaner, healthier living space.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/products" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto text-lg px-6 bg-lime-500 hover:bg-lime-600 text-black font-semibold"
                >
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Link to="/products?sale=true" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-lg px-6 backdrop-blur bg-white/30 border-white/50 text-white hover:bg-white/50"
                >
                  View Sales
                </Button>
              </Link>
            </div>
          </div>

          <div className="hidden lg:block" />
        </div>
      </div>

      {/* Right-side Badge */}
      <div className="absolute right-4 bottom-6 sm:right-5 sm:bottom-8 md:right-10 md:bottom-12 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-3 rounded-xl shadow-lg text-center">
        <p className="text-xs font-medium">
          Natural.<br />Sustainable.<br />Eco-conscious.
        </p>
        <p className="text-3xl font-bold mt-1">96%</p>
      </div>

      {/* Optional: Dots indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {bannerImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIdx(i)}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === currentIdx ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
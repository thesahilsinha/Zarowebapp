"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { HeroBanner } from "@/types";

// Fallback slides if no DB data yet
const FALLBACK_SLIDES: HeroBanner[] = [
  {
    id: "1",
    image_url: "",
    title: "Baked Fresh, Every Morning",
    subtitle: "Artisan breads, desserts and hampers delivered to your door in Bandra.",
    cta_text: "Shop Now",
    cta_link: "/shop",
    display_order: 1,
    is_active: true,
  },
  {
    id: "2",
    image_url: "",
    title: "Treats of the Day",
    subtitle: "Our bakers hand-pick the freshest items daily — order before 2 PM for same-day delivery.",
    cta_text: "See Today's Treats",
    cta_link: "/shop",
    display_order: 2,
    is_active: true,
  },
];

export default function HeroSlider({ banners }: { banners: HeroBanner[] }) {
  const slides = banners.length > 0 ? banners : FALLBACK_SLIDES;
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  return (
    <div className="relative w-full overflow-hidden rounded-none md:rounded-3xl bg-cream-200"
      style={{ height: "clamp(320px, 55vw, 580px)" }}>
      <AnimatePresence custom={direction} mode="popLayout">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          {/* Background */}
          {slides[current].image_url ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slides[current].image_url})` }}
            />
          ) : (
            // Placeholder gradient when no image
            <div className="absolute inset-0 bg-gradient-to-br from-brand-100 via-cream-200 to-brand-200" />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="max-w-xl"
              >
                <p className="text-brand-200 text-sm font-medium tracking-widest uppercase mb-3">
                  Zaro Bakehouse — Bandra
                </p>
                <h1 className="font-playfair text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                  {slides[current].title}
                </h1>
                {slides[current].subtitle && (
                  <p className="text-white/80 text-base md:text-lg mb-8 leading-relaxed">
                    {slides[current].subtitle}
                  </p>
                )}
                {slides[current].cta_text && (
                  <Link
                    href={slides[current].cta_link || "/shop"}
                    className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-7 py-3.5 rounded-2xl hover:bg-brand-500 hover:text-white transition-all duration-300 shadow-lg"
                  >
                    {slides[current].cta_text}
                    <ChevronRight size={18} />
                  </Link>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full flex items-center justify-center transition-all text-white"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full flex items-center justify-center transition-all text-white"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
            className={`transition-all duration-300 rounded-full ${
              i === current ? "w-8 h-2 bg-white" : "w-2 h-2 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
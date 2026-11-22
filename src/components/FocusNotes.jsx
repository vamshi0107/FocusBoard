import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Lightbulb, Target, Zap } from 'lucide-react';

export default function FocusNotes() {
  const slides = [
    {
      id: 1,
      badge: 'Productivity Tip',
      icon: Target,
      title: 'Prioritize High-Impact Tasks',
      description: 'Start your sprint by tackling high-priority blockers first. Use time-blocking techniques to eliminate distractions and maintain sustained deep work.',
      actionText: 'Tip: Group tasks by priority before starting.'
    },
    {
      id: 2,
      badge: 'Execution Rhythm',
      icon: Zap,
      title: 'Maintain Daily Momentum',
      description: 'Keep tasks moving from "To do" to "In progress" with small, incremental daily commits. Regularly review completed items to track team velocity.',
      actionText: 'Tip: Aim for at least one completed task per day.'
    },
    {
      id: 3,
      badge: 'System Hygiene',
      icon: Lightbulb,
      title: 'Keep Board Statuses Fresh',
      description: 'Update your task details and due dates consistently. Accurate status hygiene ensures dashboard statistics and completion metrics reflect real progress.',
      actionText: 'Tip: Use the quick status toggle on each task card.'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Lightweight native carousel navigation:
  // Circular index arithmetic avoids external library overhead (rejected Swiper/Embla per 24-hr scope).
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const currentSlide = slides[currentIndex];
  const Icon = currentSlide.icon;

  return (
    <section 
      aria-label="Focus Notes Carousel" 
      className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden flex flex-col justify-between"
    >
      {/* Decorative Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

      {/* Top Bar: Counter & Controls */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold tracking-widest uppercase text-indigo-300">
            FOCUS NOTES · {currentIndex + 1} OF {slides.length}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
            {currentSlide.badge}
          </span>
        </div>

        {/* Prev / Next Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center transition-all text-white border border-white/10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center transition-all text-white border border-white/10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Slide Body */}
      <div className="relative z-10 my-2">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/40 border border-indigo-400/30 flex items-center justify-center shrink-0 text-indigo-300">
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {currentSlide.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              {currentSlide.description}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Quick Tip & Dot Indicators */}
      <div className="mt-4 pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <p className="text-[11px] text-indigo-300/80 font-medium italic">
          {currentSlide.actionText}
        </p>

        {/* Indicators */}
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Slide indicators">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={idx === currentIndex}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'w-6 bg-indigo-400'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

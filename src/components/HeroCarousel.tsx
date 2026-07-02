'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AniListManga } from '@/lib/anilist';

interface HeroCarouselProps {
  manga: AniListManga[];
}

export default function HeroCarousel({ manga }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % manga.length);
        setIsTransitioning(false);
      }, 300);
    }, 7000);

    return () => clearInterval(interval);
  }, [manga.length]);

  const currentManga = manga[currentSlide];
  const backgroundImage = currentManga.bannerImage || currentManga.coverImage.extraLarge || currentManga.coverImage.large;
  const formattedScore = currentManga.averageScore ? (currentManga.averageScore / 10).toFixed(1) : null;

  return (
    <div className="relative h-[45vh] md:h-[500px] lg:h-[600px] overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src={backgroundImage}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover object-center opacity-40 transition-opacity duration-300 ${isTransitioning ? 'opacity-20' : 'opacity-40'}`}
        />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-neutral-950 via-neutral-950/50 to-transparent" />

      {/* Hero Content */}
      <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] md:text-xs font-semibold uppercase tracking-wider">
              Featured
            </span>
            {formattedScore && (
              <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] md:text-xs font-semibold">
                {formattedScore}
              </span>
            )}
          </div>
          <h1 className={`text-2xl md:text-4xl lg:text-6xl font-black tracking-tight mb-2 md:mb-4 transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
            {currentManga.title.english || currentManga.title.romaji}
          </h1>
          <p className={`text-neutral-300 text-xs md:text-sm lg:text-base line-clamp-2 md:line-clamp-3 mb-4 md:mb-8 max-w-xl transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
            {currentManga.description || 'No description available.'}
          </p>
          <div className="flex items-center gap-3 md:gap-4">
            <Link
              href={`/manga/${currentManga.id}`}
              className="px-6 py-2.5 md:px-8 md:py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all hover:shadow-emerald-500/25 hover:shadow-lg hover:-translate-y-0.5 text-sm md:text-base"
            >
              Read Now
            </Link>
            <button className="px-6 py-2.5 md:px-8 md:py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold transition-all text-sm md:text-base">
              Add to Library
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 md:bottom-8 right-4 md:right-8 flex items-center gap-2 z-20">
        {manga.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentSlide(index);
                setIsTransitioning(false);
              }, 300);
            }}
            className={`w-8 md:w-12 h-1 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-emerald-500' : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

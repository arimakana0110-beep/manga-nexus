"use client";

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';

export default function Navbar() {
  const [liveReaders, setLiveReaders] = useState<number>(1);

  useEffect(() => {
    const syncMangaLumeTraffic = async () => {
      try {
        const response = await fetch('/api/presence');
        if (response.ok) {
          const data = await response.json();
          setLiveReaders(data.readers);
        }
      } catch (error) {
        console.error("Traffic tracker handshake failed:", error);
      }
    };

    // Run the exact millisecond the user enters the application shell
    syncMangaLumeTraffic();

    // Set up a heartbeat loop every 10 seconds to keep this user active and update the view counter
    const loopTimer = setInterval(syncMangaLumeTraffic, 10000);
    return () => clearInterval(loopTimer);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group select-none">
              {/* Modern Icon Wrapper with Hover Glow Effect */}
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 transition-all duration-300 group-hover:border-emerald-500/50 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                <Sparkles className="w-4.5 h-4.5 text-emerald-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              </div>

              {/* Premium Gradient Branding Typography */}
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent group-hover:from-white group-hover:via-emerald-100 group-hover:to-emerald-400 transition-all duration-300">
                Manga<span className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">Lume</span>
              </span>
            </Link>

            {/* Live Reader Counter */}
            <div className="flex items-center gap-1.5 ml-2 text-neutral-400 text-[11px] sm:text-xs font-medium select-none animate-fade-in">
              {/* Live Pulsing Beacon */}
              <span className="relative flex h-1.5 w-1.5 mr-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              
              {/* Requested text representation style */}
              <span>
                {liveReaders} <span className="text-neutral-500 font-normal">reading now</span>
              </span>
            </div>
          </div>

          {/* Search Bar and Filter */}
          <div className="flex items-center gap-3">
            <FilterPanel />
            <SearchBar />
          </div>
        </div>
      </div>
    </nav>
  );
}

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
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

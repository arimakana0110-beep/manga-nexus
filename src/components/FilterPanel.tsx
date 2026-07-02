'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 
  'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life',
  'Sports', 'Supernatural', 'Thriller', 'Psychological', 'Isekai',
  'Ecchi'
];

const FORMAT_OPTIONS = [
  { value: 'manga', label: 'Manga' },
  { value: 'manhwa', label: 'Manhwa' },
  { value: 'manhua', label: 'Manhua' },
];

const SORT_OPTIONS = [
  { value: 'TRENDING', label: 'Trending' },
  { value: 'POPULARITY', label: 'Popular' },
  { value: 'UPDATED', label: 'Recently Updated' },
  { value: 'SCORE', label: 'Top Rated' },
];

export default function FilterPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState('TRENDING');
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (selectedGenres.length > 0) {
      params.set('genres', selectedGenres.join(','));
    }
    if (selectedFormat) {
      params.set('format', selectedFormat);
    }
    params.set('sort', selectedSort);
    router.push(`/browse?${params.toString()}`);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedSort('TRENDING');
    setSelectedFormat('');
    router.push('/browse');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800/50 border border-white/10 text-white hover:bg-neutral-800/70 hover:border-emerald-500/50 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
        <span className="hidden sm:inline text-sm">Filter</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-[9999] animate-fade-in">
          <div className="p-4 border-b border-neutral-800">
            <h3 className="text-sm font-semibold text-neutral-100 mb-3">Sort By</h3>
            <div className="flex flex-wrap gap-2">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedSort(option.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedSort === option.value
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                      : 'bg-neutral-800/50 text-neutral-300 hover:bg-neutral-800 border border-white/5'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-b border-neutral-800">
            <h3 className="text-sm font-semibold text-neutral-100 mb-3">Format</h3>
            <div className="flex flex-wrap gap-2">
              {FORMAT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedFormat(selectedFormat === option.value ? '' : option.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedFormat === option.value
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                      : 'bg-neutral-800/50 text-neutral-300 hover:bg-neutral-800 border border-white/5'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-sm font-semibold text-neutral-100 mb-3">Genres</h3>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedGenres.includes(genre)
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                      : 'bg-neutral-800/50 text-neutral-300 hover:bg-neutral-800 border border-white/5'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-neutral-800 flex gap-2">
            <button
              onClick={clearFilters}
              className="flex-1 px-4 py-2 rounded-lg bg-neutral-800/50 text-neutral-300 hover:bg-neutral-800 transition-colors text-sm font-medium"
            >
              Clear
            </button>
            <button
              onClick={applyFilters}
              className="flex-1 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 transition-colors text-sm font-medium"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { searchManga } from '@/lib/anilist';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 2) {
        setIsLoading(true);
        try {
          const searchResults = await searchManga(query);
          setResults(searchResults);
          setIsOpen(true);
        } catch (error) {
          console.error('Search error:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative hidden sm:block">
      <input
        type="text"
        placeholder="Search manga..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length >= 2 && setIsOpen(true)}
        className="w-80 px-4 py-2.5 rounded-xl bg-neutral-800/50 border border-white/10 text-white placeholder-neutral-400 focus:outline-none focus:border-emerald-500/50 focus:bg-neutral-800/70 transition-all"
      />
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-neutral-400">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-emerald-500 border-t-transparent"></div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-neutral-400 text-sm">
              No results found
            </div>
          ) : (
            results.map((manga) => (
              <Link
                key={manga.id}
                href={`/manga/${manga.id}`}
                onClick={() => {
                  setIsOpen(false);
                  setQuery('');
                }}
                className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
              >
                <img
                  src={manga.coverImage.large}
                  alt={manga.title.english || manga.title.romaji}
                  className="w-12 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white truncate">
                    {manga.title.english || manga.title.romaji}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-neutral-400">
                    {manga.format && <span>{manga.format}</span>}
                    {manga.startDate?.year && <span>• {manga.startDate.year}</span>}
                    {manga.averageScore && <span>• {manga.averageScore}%</span>}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}

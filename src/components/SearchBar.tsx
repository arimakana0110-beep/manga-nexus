'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { searchManga } from '@/lib/anilist';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative">
      {/* Mobile Search Icon */}
      <button
        onClick={() => setIsExpanded(true)}
        className="sm:hidden p-2 rounded-lg hover:bg-neutral-800/50 transition-colors text-neutral-400 hover:text-white"
        aria-label="Search"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
      </button>

      {/* Desktop Search Bar */}
      <div className="hidden sm:block relative">
        <input
          type="text"
          placeholder="Search manga..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="w-80 px-4 py-2.5 rounded-xl bg-neutral-800/50 border border-white/10 text-white placeholder-neutral-400 focus:outline-none focus:border-emerald-500/50 focus:bg-neutral-800/70 transition-all"
        />
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-[9999] max-h-96 overflow-y-auto">
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
                  className="flex items-center gap-4 p-4 hover:bg-neutral-800 transition-colors border-b border-neutral-800 last:border-0 opacity-100"
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
                      {manga.averageScore && <span>• {(manga.averageScore / 10).toFixed(1)}</span>}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>

      {/* Mobile Expanded Search Overlay */}
      {isExpanded && (
        <div className="fixed inset-0 z-[9999] bg-neutral-950 sm:hidden">
          <div className="container mx-auto px-4 pt-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 rounded-lg hover:bg-neutral-800/50 transition-colors text-neutral-400 hover:text-white"
                aria-label="Close search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
              <input
                type="text"
                placeholder="Search manga..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="flex-1 px-4 py-3 rounded-xl bg-neutral-800/50 border border-white/10 text-white placeholder-neutral-400 focus:outline-none focus:border-emerald-500/50 focus:bg-neutral-800/70 transition-all text-lg"
              />
            </div>
            
            {isOpen && (
              <div className="mt-4 bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden max-h-[calc(100vh-120px)] overflow-y-auto">
                {isLoading ? (
                  <div className="p-8 text-center text-neutral-400">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent"></div>
                  </div>
                ) : results.length === 0 ? (
                  <div className="p-8 text-center text-neutral-400">
                    No results found
                  </div>
                ) : (
                  results.map((manga) => (
                    <Link
                      key={manga.id}
                      href={`/manga/${manga.id}`}
                      onClick={() => {
                        setIsOpen(false);
                        setIsExpanded(false);
                        setQuery('');
                      }}
                      className="flex items-center gap-4 p-4 hover:bg-neutral-800 transition-colors border-b border-neutral-800 last:border-0 opacity-100"
                    >
                      <img
                        src={manga.coverImage.large}
                        alt={manga.title.english || manga.title.romaji}
                        className="w-16 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white truncate text-base">
                          {manga.title.english || manga.title.romaji}
                        </h3>
                        <div className="flex items-center gap-2 mt-2 text-sm text-neutral-400">
                          {manga.format && <span>{manga.format}</span>}
                          {manga.startDate?.year && <span>• {manga.startDate.year}</span>}
                          {manga.averageScore && <span>• {(manga.averageScore / 10).toFixed(1)}</span>}
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

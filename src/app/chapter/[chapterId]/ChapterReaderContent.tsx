'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MangaChapter } from '@/lib/mangaProvider';

interface ChapterReaderContentProps {
  pageUrls: string[];
  backUrl: string;
  chapters: MangaChapter[];
  currentChapterId: string;
  providerMangaId?: string;
  anilistId?: string;
}

function MangaPanel({ url, index }: { url: string; index: number }) {
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  return (
    <div className="relative w-full min-h-[60vh] bg-neutral-900/40 flex items-center justify-center">
      {!isImgLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-950/20 animate-pulse">
          <div className="w-8 h-8 border-2 border-neutral-700 border-t-emerald-500 rounded-full animate-spin" />
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 mt-3">Fetching panel...</span>
        </div>
      )}
      <img 
        src={url} 
        alt={`Page ${index + 1}`}
        loading={index < 2 ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setIsImgLoaded(true)}
        className={`w-full h-auto transition-opacity duration-500 ease-in-out object-contain ${isImgLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}

export default function ChapterReaderContent({ 
  pageUrls, 
  backUrl, 
  chapters, 
  currentChapterId,
  providerMangaId,
  anilistId 
}: ChapterReaderContentProps) {
  const [showControls, setShowControls] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  // Calculate previous and next chapter indices
  const currentIndex = chapters.findIndex(ch => ch.id === currentChapterId);
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  const handleScreenTap = () => {
    setShowControls(!showControls);
  };

  const handleControlClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleChapterNavigation = (e: React.MouseEvent, chapterId: string) => {
    e.stopPropagation();
    setIsNavigating(true);
    router.push(`/chapter/${encodeURIComponent(chapterId)}?providerMangaId=${providerMangaId}&anilistId=${anilistId}`);
  };

  return (
    <div 
      className="bg-neutral-950 text-neutral-100 min-h-screen flex flex-col items-center select-none animate-fade-in"
      onClick={handleScreenTap}
    >
      {/* Navigation Loading Overlay */}
      {isNavigating && (
        <div className="fixed inset-0 bg-neutral-950/70 backdrop-blur-md z-[100] flex flex-col items-center justify-center transition-all duration-300">
          <div className="w-12 h-12 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-xs tracking-widest text-neutral-400 mt-4 uppercase animate-pulse">
            Syncing Panels...
          </p>
        </div>
      )}

      {/* Top Header Control */}
      <div 
        className={`fixed top-0 left-0 right-0 z-50 bg-neutral-900/80 backdrop-blur-md border-b border-white/5 transition-all duration-300 ${
          showControls ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="container mx-auto px-4 py-3">
          <Link
            href={backUrl}
            onClick={handleControlClick}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors text-sm text-neutral-300 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
            <span>Back to Manga</span>
          </Link>
        </div>
      </div>

      {/* Manga Pages Container */}
      <div className="w-full max-w-2xl md:max-w-3xl mx-auto px-1 space-y-1 py-4 mt-16 pb-24">
        {pageUrls.map((url, index) => (
          <MangaPanel key={index} url={url} index={index} />
        ))}
      </div>

      {/* Bottom Navigation Dock */}
      <div 
        className={`fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/80 backdrop-blur-md border-t border-neutral-800/60 p-4 shadow-xl transition-all duration-300 ${
          showControls ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
            {/* Previous Chapter Button */}
            {prevChapter ? (
              <button
                onClick={(e) => handleChapterNavigation(e, prevChapter.id)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors text-neutral-300 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"></path><path d="M9 12h12"></path></svg>
                <span className="hidden sm:inline text-sm">Previous</span>
              </button>
            ) : (
              <button
                disabled
                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-neutral-800/30 text-neutral-600 cursor-not-allowed opacity-20 pointer-events-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"></path><path d="M9 12h12"></path></svg>
                <span className="hidden sm:inline text-sm">Previous</span>
              </button>
            )}

            {/* Return to Menu Button */}
            <Link
              href={backUrl}
              onClick={handleControlClick}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              <span className="text-sm font-medium">Menu</span>
            </Link>

            {/* Next Chapter Button */}
            {nextChapter ? (
              <button
                onClick={(e) => handleChapterNavigation(e, nextChapter.id)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors text-neutral-300 hover:text-white"
              >
                <span className="hidden sm:inline text-sm">Next</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"></path><path d="M15 12H3"></path></svg>
              </button>
            ) : (
              <button
                disabled
                className="flex items-center gap-2 px-4 py-3 rounded-lg bg-neutral-800/30 text-neutral-600 cursor-not-allowed opacity-20 pointer-events-none"
              >
                <span className="hidden sm:inline text-sm">Next</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"></path><path d="M15 12H3"></path></svg>
              </button>
            )}
          </div>
      </div>
    </div>
  );
}

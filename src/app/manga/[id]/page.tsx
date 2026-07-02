import { fetchMangaDetails } from '@/lib/anilist';
import { getChapters, pickBestSearchResult, searchManga } from '@/lib/mangaProvider';
import Link from 'next/link';

export default async function MangaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mangaDetails = await fetchMangaDetails(id);

  if (!mangaDetails || !mangaDetails.title) {
    return (
      <div className="bg-neutral-950 text-neutral-100 min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-neutral-900 rounded-xl border border-neutral-800 max-w-sm">
          <h1 className="text-xl font-bold text-red-400 mb-2">AniList Engine Desync</h1>
          <p className="text-neutral-400 text-sm mb-4">Could not parse data for media parameter ID: {id}</p>
          <Link href="/" className="text-xs text-neutral-300 underline hover:text-white">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const title =
    mangaDetails.title.english ||
    mangaDetails.title.romaji ||
    (mangaDetails.title as { native?: string }).native ||
    'Unknown Title';

  const bannerImage = mangaDetails.bannerImage || mangaDetails.coverImage.extraLarge;

  const searchResults = await searchManga(title);
  const matchedManga = pickBestSearchResult(searchResults, title);
  const chapters = matchedManga ? await getChapters(matchedManga.id) : [];

  return (
    <div className="bg-neutral-950 text-neutral-100 min-h-screen relative overflow-hidden animate-fade-in">
      {/* Dynamic Ambient Backdrop */}
      <div className="absolute top-0 left-0 right-0 h-[600px] overflow-hidden pointer-events-none">
        <img
          src={bannerImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-150 blur-[140px]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950 to-neutral-950" />
      </div>

      {/* Cinematic Hero Header */}
      <div className="relative h-56 md:h-[360px] w-full overflow-hidden">
        <img
          src={bannerImage}
          alt={title}
          className="w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-transparent to-neutral-950/90" />
      </div>

      {/* Responsive Matrix Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto px-4 -mt-32 relative z-10">
        {/* Left Column - Sidebar (3 cols) */}
        <div className="lg:col-span-3 lg:sticky lg:top-24 lg:self-start">
          <div className="group relative">
            <img
              src={mangaDetails.coverImage.extraLarge}
              alt={title}
              className="w-full rounded-2xl shadow-2xl border border-white/10 transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 pointer-events-none" />
          </div>
        </div>

        {/* Right Column - Main Stream (9 cols) */}
        <div className="lg:col-span-9 space-y-8">
          {/* Title & Genres - Glassmorphic Panel */}
          <div className="bg-neutral-900/25 backdrop-blur-xl border border-white/5 shadow-xl rounded-2xl p-6 md:p-8">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">{title}</h1>
            <div className="flex flex-wrap gap-2">
              {mangaDetails.genres?.map((genre) => (
                <span
                  key={genre}
                  className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-200 text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>

          {/* Synopsis - Glassmorphic Panel */}
          <div className="bg-neutral-900/25 backdrop-blur-xl border border-white/5 shadow-xl rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-4 text-neutral-100">Synopsis</h2>
            <div
              className="text-neutral-300 text-sm md:text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: mangaDetails.description || 'No summary index compiled.' }}
            />
          </div>

          {/* Chapter List - Glassmorphic Panel */}
          <div className="bg-neutral-900/25 backdrop-blur-xl border border-white/5 shadow-xl rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-neutral-100">Chapters</h2>
              {chapters.length > 0 && (
                <span className="text-sm text-neutral-400 font-mono">
                  {chapters.length} chapters
                </span>
              )}
            </div>
            
            {chapters.length === 0 ? (
              <div className="text-neutral-400 py-16 text-center bg-neutral-900/30 rounded-xl border border-white/5">
                {matchedManga
                  ? 'No chapters are available for this title from the active provider.'
                  : 'Could not match this title to a readable source in the provider catalog.'}
              </div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {chapters.map((chapter) => (
                  <Link
                    key={chapter.id}
                    href={`/chapter/${encodeURIComponent(chapter.id)}?providerMangaId=${matchedManga?.id}&anilistId=${id}`}
                    className="group block py-4 px-5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300 group-hover:translate-x-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-xs md:text-sm font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                          Ch. {chapter.chapterNumber}
                        </span>
                        {chapter.title && chapter.title !== `Chapter ${chapter.chapterNumber}` && (
                          <span className="text-neutral-300 text-sm md:text-base line-clamp-1">
                            {chapter.title}
                          </span>
                        )}
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all duration-300"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
//hello
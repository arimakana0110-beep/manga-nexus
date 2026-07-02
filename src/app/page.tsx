import { fetchTrendingManga, fetchPopularManga, fetchTopRatedManga, fetchRecentlyUpdatedManga } from '@/lib/anilist';
import Link from 'next/link';
import HeroCarousel from '@/components/HeroCarousel';

export default async function Home() {
  const trendingManga = await fetchTrendingManga();
  const popularManga = await fetchPopularManga();
  const topRatedManga = await fetchTopRatedManga();
  const recentlyUpdatedManga = await fetchRecentlyUpdatedManga();

  const heroCarouselManga = trendingManga.slice(0, 5);
  const topTrending = trendingManga.slice(0, 10);
  const mostViewed = topRatedManga.slice(0, 10);
  const recentlyUpdated = recentlyUpdatedManga.slice(0, 8);

  return (
    <div className="bg-neutral-950 text-neutral-100 min-h-screen animate-fade-in">
      {/* Hero Carousel */}
      <HeroCarousel manga={heroCarouselManga} />

      {/* Horizontal Media Shelves */}
      <main className="container mx-auto px-4 py-8 md:py-12 space-y-8 md:space-y-12">
        {/* Trending Right Now */}
        <section>
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">Trending Right Now</h2>
            <Link href="#" className="text-emerald-400 hover:text-emerald-300 text-xs md:text-sm font-medium transition-colors">
              View All
            </Link>
          </div>
          <div className="flex gap-3 md:gap-4 overflow-x-auto whitespace-nowrap scrollbar-none pb-4">
            {topTrending.map((manga, index) => (
              <Link
                key={manga.id}
                href={`/manga/${manga.id}`}
                className="flex-shrink-0 w-[140px] sm:w-40 group"
              >
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2 md:mb-3 border border-white/5 hover:border-emerald-500/30 transition-all hover:-translate-y-1 hover:shadow-emerald-500/10 hover:shadow-xl">
                  <img
                    src={manga.coverImage.large}
                    alt={manga.title.english || manga.title.romaji}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 md:px-2 md:py-1 rounded-lg bg-black/70 backdrop-blur-sm text-white text-[10px] md:text-xs font-bold">
                    #{index + 1}
                  </div>
                  {manga.averageScore && (
                    <div className="absolute bottom-2 left-2 px-1.5 py-0.5 md:px-2 md:py-1 rounded-lg bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] md:text-xs font-bold">
                      {manga.averageScore}
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-xs md:text-sm text-neutral-100 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                  {manga.title.english || manga.title.romaji}
                </h3>
              </Link>
            ))}
          </div>
        </section>

        {/* Most Viewed This Week */}
        <section>
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">Most Viewed This Week</h2>
            <Link href="#" className="text-emerald-400 hover:text-emerald-300 text-xs md:text-sm font-medium transition-colors">
              View All
            </Link>
          </div>
          <div className="flex gap-3 md:gap-4 overflow-x-auto whitespace-nowrap scrollbar-none pb-4">
            {mostViewed.map((manga, index) => (
              <Link
                key={manga.id}
                href={`/manga/${manga.id}`}
                className="flex-shrink-0 w-[140px] sm:w-40 group"
              >
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2 md:mb-3 border border-white/5 hover:border-emerald-500/30 transition-all hover:-translate-y-1 hover:shadow-emerald-500/10 hover:shadow-xl">
                  <img
                    src={manga.coverImage.large}
                    alt={manga.title.english || manga.title.romaji}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-[10px] md:text-sm">
                    {index + 1}
                  </div>
                </div>
                <h3 className="font-medium text-xs md:text-sm text-neutral-100 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                  {manga.title.english || manga.title.romaji}
                </h3>
              </Link>
            ))}
          </div>
        </section>

        {/* Recently Updated */}
        <section>
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">Recently Updated</h2>
            <Link href="#" className="text-emerald-400 hover:text-emerald-300 text-xs md:text-sm font-medium transition-colors">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {recentlyUpdated.map((manga) => (
              <Link
                key={manga.id}
                href={`/manga/${manga.id}`}
                className="group flex gap-3 md:gap-4 p-2 md:p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-emerald-500/30 transition-all"
              >
                <div className="flex-shrink-0 w-12 md:w-16 aspect-[2/3] rounded-lg overflow-hidden">
                  <img
                    src={manga.coverImage.large}
                    alt={manga.title.english || manga.title.romaji}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <h3 className="font-medium text-xs md:text-sm text-neutral-100 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                    {manga.title.english || manga.title.romaji}
                  </h3>
                  <div className="mt-1.5 md:mt-2 text-[10px] md:text-xs text-neutral-400">
                    Ch. {Math.floor(Math.random() * 100) + 1} • {Math.floor(Math.random() * 60) + 1} mins ago
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

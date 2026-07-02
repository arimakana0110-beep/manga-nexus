import { fetchFilteredManga } from '@/lib/anilist';
import Link from 'next/link';
import FilterPanel from '@/components/FilterPanel';

export const dynamic = 'force-dynamic';

interface BrowsePageProps {
  searchParams: Promise<{ genres?: string; sort?: string; format?: string; page?: string }>;
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const { genres: genresParam, sort: sortParam, format: formatParam, page: pageParam } = await searchParams;
  
  const genres = genresParam ? genresParam.split(',').map(g => g.trim()) : [];
  const sort = sortParam || 'TRENDING';
  const format = formatParam;
  const page = parseInt(pageParam || '1', 10);

  const manga = await fetchFilteredManga(genres, sort, format, page);

  const sortLabels: Record<string, string> = {
    'TRENDING': 'Trending',
    'POPULARITY': 'Popular',
    'UPDATED': 'Recently Updated',
    'SCORE': 'Top Rated',
  };

  const formatLabels: Record<string, string> = {
    'manga': 'Manga',
    'manhwa': 'Manhwa',
    'manhua': 'Manhua',
  };

  return (
    <div className="bg-neutral-950 text-neutral-100 min-h-screen animate-fade-in">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-neutral-950/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Browse Manga</h1>
              <p className="text-sm text-neutral-400 mt-1">
                {genres.length > 0 
                  ? `Genres: ${genres.join(', ')}` 
                  : format 
                    ? `Format: ${formatLabels[format] || format}`
                    : sortLabels[sort] || 'All Manga'}
              </p>
            </div>
            <FilterPanel />
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <main className="container mx-auto px-4 py-8">
        {manga.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-neutral-400">No manga found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {manga.map((item) => (
              <Link
                key={item.id}
                href={`/manga/${item.id}`}
                className="group"
              >
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2 border border-white/5 hover:border-emerald-500/30 transition-all hover:-translate-y-1 hover:shadow-emerald-500/10 hover:shadow-xl">
                  <img
                    src={item.coverImage.large}
                    alt={item.title.english || item.title.romaji}
                    className="w-full h-full object-cover"
                  />
                  {item.averageScore && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-bold">
                      {(item.averageScore / 10).toFixed(1)}
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-xs sm:text-sm text-neutral-100 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                  {item.title.english || item.title.romaji}
                </h3>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {manga.length > 0 && (
          <div className="flex justify-center gap-2 mt-8">
            {page > 1 && (
              <Link
                href={`/browse?genres=${genresParam || ''}&sort=${sort}&format=${format || ''}&page=${page - 1}`}
                className="px-4 py-2 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors text-sm"
              >
                Previous
              </Link>
            )}
            <span className="px-4 py-2 text-sm text-neutral-400">
              Page {page}
            </span>
            <Link
              href={`/browse?genres=${genresParam || ''}&sort=${sort}&format=${format || ''}&page=${page + 1}`}
              className="px-4 py-2 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors text-sm"
            >
              Next
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

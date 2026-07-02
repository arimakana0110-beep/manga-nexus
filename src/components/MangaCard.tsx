import Link from 'next/link';

interface MangaCardProps {
  id: number;
  title: string;
  coverImage: string;
  averageScore: number;
}

export default function MangaCard({ id, title, coverImage, averageScore }: MangaCardProps) {
  const formattedScore = averageScore ? (averageScore / 10).toFixed(1) : 'N/A';

  return (
    <Link href={`/manga/${id}`}>
      <div className="group relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm transition-all duration-300 hover:border-neutral-600 hover:shadow-xl hover:shadow-neutral-900/50 hover:-translate-y-1">
        {/* Cover Image */}
        <div className="relative aspect-[2/3] overflow-hidden bg-neutral-800">
          <img
            src={coverImage}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {/* Rating Badge */}
          <div className="absolute top-2 right-2 rounded-lg bg-black/70 px-2 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {formattedScore}
          </div>
        </div>

        {/* Title */}
        <div className="p-3">
          <h3 className="line-clamp-2 text-sm font-medium text-neutral-100 group-hover:text-neutral-200">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
}

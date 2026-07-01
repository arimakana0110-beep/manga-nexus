import { getChapterPages } from '@/lib/mangaProvider';
import { toProxiedImageUrl } from '@/lib/imageProxy';
import Link from 'next/link';

interface ChapterPageProps {
  params: Promise<{ chapterId: string }>;
  searchParams: Promise<{ manga?: string }>;
}

export default async function ChapterReaderPage({ params, searchParams }: ChapterPageProps) {
  const { chapterId } = await params;
  const { manga: mangaId } = await searchParams;
  const decodedChapterId = decodeURIComponent(chapterId);

  let pageUrls: string[] = [];
  let errorOccurred = false;

  try {
    const rawPages = await getChapterPages(decodedChapterId);
    pageUrls = rawPages.map(toProxiedImageUrl);
  } catch {
    errorOccurred = true;
  }

  const backUrl = mangaId ? `/manga/${mangaId}` : '/';

  if (errorOccurred || pageUrls.length === 0) {
    return (
      <div className="bg-black text-neutral-100 min-h-screen flex flex-col items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold mb-4 text-neutral-200">Chapter Content Unreachable</h1>
          <p className="text-neutral-400 text-sm mb-8">
            This chapter could not be loaded from the active manga provider. Try another chapter or check back later.
          </p>
          <Link
            href={backUrl}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 transition-colors text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
            Return to Manga Info
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-950 text-neutral-100 min-h-screen flex flex-col items-center select-none">
      <div className="w-full max-w-2xl md:max-w-3xl mx-auto px-1 space-y-1 py-4">
        {pageUrls.map((url, index) => (
          <div key={index} className="relative w-full bg-neutral-900/30 min-h-[40vh] flex items-center justify-center">
            <img
              src={url}
              alt={`Page ${index + 1}`}
              loading={index < 2 ? 'eager' : 'lazy'}
              decoding="async"
              className="w-full h-auto block object-contain"
            />
          </div>
        ))}
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-neutral-900/90 backdrop-blur-md px-5 py-2.5 rounded-full border border-neutral-800 flex items-center gap-4 shadow-2xl">
        <Link
          href={backUrl}
          className="p-2 rounded-full hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-neutral-100 flex items-center gap-1.5 text-xs px-3"
          title="Back to Manga Info"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>
          <span>Return to Menu</span>
        </Link>
      </div>
    </div>
  );
}

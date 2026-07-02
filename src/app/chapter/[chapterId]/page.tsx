import { getChapterPages, getChapters, MangaChapter } from '@/lib/mangaProvider';
import { toProxiedImageUrl } from '@/lib/imageProxy';
import Link from 'next/link';
import ChapterReaderContent from './ChapterReaderContent';

export const dynamic = 'force-dynamic';

interface ChapterPageProps {
  params: Promise<{ chapterId: string }>;
  searchParams: Promise<{ providerMangaId?: string; anilistId?: string }>;
}

export default async function ChapterReaderPage({ params, searchParams }: ChapterPageProps) {
  const { chapterId } = await params;
  const { providerMangaId, anilistId } = await searchParams;
  const decodedChapterId = decodeURIComponent(chapterId);

  let pageUrls: string[] = [];
  let chapters: MangaChapter[] = [];
  let errorOccurred = false;

  try {
    const rawPages = await getChapterPages(decodedChapterId);
    pageUrls = rawPages.map(toProxiedImageUrl);
    
    if (providerMangaId) {
      chapters = await getChapters(providerMangaId);
    }
  } catch {
    errorOccurred = true;
  }

  const backUrl = anilistId ? `/manga/${anilistId}` : '/';

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
    <ChapterReaderContent 
      pageUrls={pageUrls} 
      backUrl={backUrl} 
      chapters={chapters}
      currentChapterId={decodedChapterId}
      providerMangaId={providerMangaId}
      anilistId={anilistId}
    />
  );
}

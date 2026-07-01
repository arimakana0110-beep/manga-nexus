import { MANGA } from '@consumet/extensions';

const CONSUMET_API_URL = process.env.CONSUMET_API_URL ?? 'https://api.consumet.org';
const PROVIDER = process.env.MANGA_PROVIDER ?? 'mangapill';

export interface MangaSearchResult {
  id: string;
  title: string;
  image?: string;
}

export interface MangaChapter {
  id: string;
  title: string;
  chapterNumber: string;
}

function getProviderClient() {
  switch (PROVIDER) {
    case 'mangakakalot':
      return new MANGA.MangaKakalot();
    case 'mangahere':
      return new MANGA.MangaHere();
    case 'mangareader':
      return new MANGA.MangaReader();
    case 'comick':
      return new MANGA.ComicK();
    case 'mangapill':
    default:
      return new MANGA.MangaPill();
  }
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[()[\]{}]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function formatSearchTitle(title: unknown): string {
  if (typeof title === 'string') {
    return title;
  }

  if (Array.isArray(title)) {
    const english = title.find((entry) => entry?.[0] === 'en')?.[1];
    return english ?? title[0]?.[1] ?? 'Unknown Title';
  }

  if (title && typeof title === 'object') {
    const localized = title as { english?: string; romaji?: string };
    return localized.english ?? localized.romaji ?? 'Unknown Title';
  }

  return 'Unknown Title';
}

function extractChapterNumber(chapter: { title: string; id: string; chapter?: string }): string {
  if (chapter.chapter) {
    return chapter.chapter;
  }

  const fromTitle = chapter.title.match(/(?:chapter|ch\.?)\s*(\d+(?:\.\d+)?)/i)?.[1];
  if (fromTitle) {
    return fromTitle;
  }

  const fromId = chapter.id.match(/chapter[-_]?(\d+(?:\.\d+)?)/i)?.[1];
  return fromId ?? '0';
}

async function fetchFromConsumetApi<T>(path: string, params?: Record<string, string>): Promise<T | null> {
  const url = new URL(`${CONSUMET_API_URL}${path}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 1800 },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export function pickBestSearchResult(
  results: MangaSearchResult[],
  query: string
): MangaSearchResult | null {
  if (results.length === 0) {
    return null;
  }

  const normalizedQuery = normalizeTitle(query);

  const exactMatch = results.find(
    (result) => normalizeTitle(result.title) === normalizedQuery
  );
  if (exactMatch) {
    return exactMatch;
  }

  const partialMatch = results.find((result) => {
    const normalizedResult = normalizeTitle(result.title);
    return (
      normalizedResult.includes(normalizedQuery) ||
      normalizedQuery.includes(normalizedResult)
    );
  });
  if (partialMatch) {
    return partialMatch;
  }

  return results[0];
}

export async function searchManga(title: string): Promise<MangaSearchResult[]> {
  const cleanedTitle = normalizeTitle(title) || title.trim();

  try {
    const provider = getProviderClient();
    const data = await provider.search(cleanedTitle);

    return (data.results ?? []).map((result) => ({
      id: result.id,
      title: formatSearchTitle(result.title),
      image: typeof result.image === 'string' ? result.image : undefined,
    }));
  } catch (error) {
    console.error(`[mangaProvider] Extension search failed for "${title}":`, error);

    const apiData = await fetchFromConsumetApi<{
      results: Array<{ id: string; title: string; image?: string }>;
    }>(`/manga/${PROVIDER}/${encodeURIComponent(cleanedTitle)}`, { page: '1' });

    return (apiData?.results ?? []).map((result) => ({
      id: result.id,
      title: result.title,
      image: result.image,
    }));
  }
}

export async function getChapters(mangaId: string): Promise<MangaChapter[]> {
  try {
    const provider = getProviderClient();
    const info = await provider.fetchMangaInfo(mangaId);

    const chapters = (info.chapters ?? []).map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      chapterNumber: extractChapterNumber(chapter),
    }));

    chapters.sort(
      (a, b) => parseFloat(a.chapterNumber) - parseFloat(b.chapterNumber)
    );

    return chapters;
  } catch (error) {
    console.error(`[mangaProvider] Extension chapter fetch failed for "${mangaId}":`, error);

    const apiData = await fetchFromConsumetApi<{
      chapters: Array<{ id: string; title: string }>;
    }>(`/manga/${PROVIDER}/info`, { id: mangaId });

    const chapters = (apiData?.chapters ?? []).map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      chapterNumber: extractChapterNumber(chapter),
    }));

    chapters.sort(
      (a, b) => parseFloat(a.chapterNumber) - parseFloat(b.chapterNumber)
    );

    return chapters;
  }
}

export async function getChapterPages(chapterId: string): Promise<string[]> {
  try {
    const provider = getProviderClient();
    const pages = await provider.fetchChapterPages(chapterId);

    return pages
      .sort((a, b) => a.page - b.page)
      .map((page) => page.img);
  } catch (error) {
    console.error(`[mangaProvider] Extension page fetch failed for "${chapterId}":`, error);

    const apiData = await fetchFromConsumetApi<Array<{ img: string; page: number }>>(
      `/manga/${PROVIDER}/read`,
      { chapterId }
    );

    if (!apiData || apiData.length === 0) {
      throw new Error(`No chapter pages found for "${chapterId}"`);
    }

    return apiData
      .sort((a, b) => a.page - b.page)
      .map((page) => page.img);
  }
}

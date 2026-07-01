const CDN_REFERERS: Record<string, string> = {
  'cdn.readdetectiveconan.com': 'https://mangapill.com/',
  'mangapill.com': 'https://mangapill.com/',
  'cdn.mangakakalot.net': 'https://mangakakalot.com/',
  'mangakakalot.com': 'https://mangakakalot.com/',
  'mangahere.cc': 'https://mangahere.cc/',
  'natomanga.com': 'https://mangapill.com/',
};

export function getRefererForImageUrl(imageUrl: string): string | null {
  try {
    const hostname = new URL(imageUrl).hostname.replace(/^www\./, '');
    return CDN_REFERERS[hostname] ?? null;
  } catch {
    return null;
  }
}

export function isAllowedImageUrl(imageUrl: string): boolean {
  try {
    const parsed = new URL(imageUrl);
    if (parsed.protocol !== 'https:') {
      return false;
    }

    const hostname = parsed.hostname.replace(/^www\./, '');
    return hostname in CDN_REFERERS;
  } catch {
    return false;
  }
}

export function toProxiedImageUrl(imageUrl: string): string {
  return `/api/image?url=${encodeURIComponent(imageUrl)}`;
}

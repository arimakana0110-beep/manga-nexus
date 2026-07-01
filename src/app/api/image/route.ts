import { getRefererForImageUrl, isAllowedImageUrl } from '@/lib/imageProxy';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl || !isAllowedImageUrl(imageUrl)) {
    return new Response('Invalid or disallowed image URL', { status: 400 });
  }

  const referer = getRefererForImageUrl(imageUrl);
  if (!referer) {
    return new Response('No referer configured for image host', { status: 400 });
  }

  try {
    const upstream = await fetch(imageUrl, {
      headers: {
        Referer: referer,
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      },
      next: { revalidate: 86400 },
    });

    if (!upstream.ok) {
      return new Response(`Upstream image fetch failed (${upstream.status})`, {
        status: upstream.status,
      });
    }

    const contentType = upstream.headers.get('content-type') ?? 'image/jpeg';
    const imageBuffer = await upstream.arrayBuffer();

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  } catch {
    return new Response('Failed to fetch image', { status: 502 });
  }
}

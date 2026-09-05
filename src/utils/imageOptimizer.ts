/**
 * Utility to optimize and transform image URLs for faster loading, LCP, and FCP.
 * Supports Supabase Storage image transformations (`/render/image/public/` with `width` and `quality`)
 * as well as Unsplash transformation parameters.
 */
export function optimizeImageUrl(
  url: string | undefined | null,
  options: { width?: number; quality?: number } = {}
): string {
  if (!url) return '';
  const { width = 800, quality = 80 } = options;

  try {
    // 1. Check if Supabase Storage URL
    // Pattern: /storage/v1/object/public/<bucket>/<path>
    if (url.includes('/storage/v1/object/public/')) {
      // Supabase image transformation endpoint uses /storage/v1/render/image/public/
      const renderUrl = url.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
      const separator = renderUrl.includes('?') ? '&' : '?';
      return `${renderUrl}${separator}width=${width}&quality=${quality}&resize=contain`;
    }

    // If it's already a render URL, ensure width and quality params
    if (url.includes('/storage/v1/render/image/public/')) {
      const urlObj = new URL(url);
      if (!urlObj.searchParams.has('width')) urlObj.searchParams.set('width', String(width));
      if (!urlObj.searchParams.has('quality')) urlObj.searchParams.set('quality', String(quality));
      return urlObj.toString();
    }

    // 2. Check if Unsplash image URL
    if (url.includes('images.unsplash.com')) {
      const urlObj = new URL(url);
      urlObj.searchParams.set('w', String(width));
      urlObj.searchParams.set('q', String(quality));
      urlObj.searchParams.set('auto', 'format');
      return urlObj.toString();
    }

    return url;
  } catch {
    return url;
  }
}

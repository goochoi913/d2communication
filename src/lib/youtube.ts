/** YouTube URL helpers. All video is hosted on YouTube; the site never self-hosts video. */

export function youtubeThumbnail(id: string, quality: "maxresdefault" | "hqdefault" | "sddefault" = "hqdefault") {
  return `https://i.ytimg.com/vi/${id}/${quality}.jpg`;
}

export function youtubeEmbedUrl(id: string, params: Record<string, string | number> = {}) {
  const query = new URLSearchParams({
    autoplay: "1",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  });
  return `https://www.youtube-nocookie.com/embed/${id}?${query}`;
}

export function youtubeWatchUrl(id: string) {
  return `https://www.youtube.com/watch?v=${id}`;
}

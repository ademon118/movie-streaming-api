import { config } from '../config.js';

function qualityFromText(text) {
  const value = text || '';
  const match = value.match(/\b(4K|2160p|1080p|720p|480p|360p)\b/i);
  return match ? match[1].toUpperCase().replace('2160P', '2160p').replace('4K', '4K') : null;
}

function normalizeStream(raw, index, addonLabel) {
  const url = typeof raw.url === 'string' ? raw.url.trim() : '';
  if (!url) return null;

  const title =
    raw.title ||
    raw.name ||
    raw.description ||
    `Stream ${index + 1}`;

  return {
    id: `addon:${index}`,
    title: String(title).slice(0, 200),
    url,
    quality: qualityFromText(`${raw.name || ''} ${raw.title || ''}`) || undefined,
    addon: addonLabel,
  };
}

/**
 * @param {'movie'|'tv'} type
 * @param {string} imdbId
 * @param {{ season?: number, episode?: number }} [opts]
 */
export async function fetchAddonStreams(type, imdbId, opts = {}) {
  if (!config.addonBaseUrl) {
    return [];
  }

  let streamPath;
  if (type === 'tv') {
    const season = opts.season;
    const episode = opts.episode;
    streamPath = `/stream/series/${imdbId}:${season}:${episode}.json`;
  } else {
    streamPath = `/stream/movie/${imdbId}.json`;
  }

  const url = `${config.addonBaseUrl}${streamPath}`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'movie_api/1.0',
    },
  });

  if (!res.ok) {
    const err = new Error(`Addon request failed (${res.status})`);
    err.status = 502;
    throw err;
  }

  const data = await res.json();
  const list = Array.isArray(data.streams) ? data.streams : [];
  const addonLabel = new URL(config.addonBaseUrl).hostname;

  return list
    .map((item, index) => normalizeStream(item, index, addonLabel))
    .filter(Boolean);
}

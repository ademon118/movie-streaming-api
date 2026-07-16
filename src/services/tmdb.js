import { config } from '../config.js';

const TMDB_API = 'https://api.themoviedb.org/3';

export async function fetchImdbId(mediaType, tmdbId) {
  if (!config.tmdbApiKey) {
    const err = new Error('TMDB_API_KEY is not configured');
    err.status = 500;
    throw err;
  }

  const path = mediaType === 'tv' ? 'tv' : 'movie';
  const url = `${TMDB_API}/${path}/${encodeURIComponent(tmdbId)}/external_ids?api_key=${encodeURIComponent(config.tmdbApiKey)}`;

  const res = await fetch(url);
  if (!res.ok) {
    const err = new Error(`TMDB external_ids failed (${res.status})`);
    err.status = 502;
    throw err;
  }

  const data = await res.json();
  const imdbId = data.imdb_id;
  if (!imdbId || typeof imdbId !== 'string') {
    const err = new Error('No IMDb id for this title');
    err.status = 404;
    throw err;
  }
  return imdbId;
}

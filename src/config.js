import dotenv from 'dotenv';

dotenv.config();

function trimSlash(value) {
  return (value || '').trim().replace(/\/+$/, '');
}

function envOrEmpty(value) {
  const trimmed = (value || '').trim();
  if (!trimmed || trimmed === 'your_tmdb_v3_api_key') return '';
  return trimmed;
}

export const config = {
  port: Number(process.env.PORT || 3000),
  tmdbApiKey: envOrEmpty(process.env.TMDB_API_KEY),
  addonBaseUrl: trimSlash(process.env.ADDON_BASE_URL),
  corsOrigin: process.env.CORS_ORIGIN || '*',
};

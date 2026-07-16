import { Router } from 'express';
import { fetchImdbId } from '../services/tmdb.js';
import { fetchAddonStreams } from '../services/stremio.js';

export const streamsRouter = Router();

streamsRouter.get('/movie/:tmdbId', async (req, res) => {
  const tmdbId = String(req.params.tmdbId || '').trim();
  if (!/^\d+$/.test(tmdbId)) {
    return res.status(400).json({ error: 'Invalid tmdbId' });
  }

  try {
    const imdbId = await fetchImdbId('movie', tmdbId);
    const streams = await fetchAddonStreams('movie', imdbId);
    return res.json({
      tmdbId,
      imdbId,
      type: 'movie',
      streams,
    });
  } catch (err) {
    const status = err.status || 502;
    return res.status(status).json({ error: err.message || 'Upstream error' });
  }
});

streamsRouter.get('/tv/:tmdbId', async (req, res) => {
  const tmdbId = String(req.params.tmdbId || '').trim();
  if (!/^\d+$/.test(tmdbId)) {
    return res.status(400).json({ error: 'Invalid tmdbId' });
  }

  const season = Number(req.query.season);
  const episode = Number(req.query.episode);
  if (!Number.isInteger(season) || season < 1 || !Number.isInteger(episode) || episode < 1) {
    return res.status(400).json({
      error: 'Query params season and episode are required (positive integers)',
    });
  }

  try {
    const imdbId = await fetchImdbId('tv', tmdbId);
    const streams = await fetchAddonStreams('tv', imdbId, { season, episode });
    return res.json({
      tmdbId,
      imdbId,
      type: 'tv',
      season,
      episode,
      streams,
    });
  } catch (err) {
    const status = err.status || 502;
    return res.status(status).json({ error: err.message || 'Upstream error' });
  }
});

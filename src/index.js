import cors from 'cors';
import express from 'express';
import { config } from './config.js';
import { streamsRouter } from './routes/streams.js';

const app = express();

app.use(
  cors({
    origin: config.corsOrigin === '*' ? true : config.corsOrigin,
  }),
);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    addonConfigured: Boolean(config.addonBaseUrl),
    tmdbConfigured: Boolean(config.tmdbApiKey),
  });
});

app.use('/streams', streamsRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(config.port, () => {
  console.log(`movie_api listening on http://localhost:${config.port}`);
  if (!config.tmdbApiKey) {
    console.warn('Warning: TMDB_API_KEY is empty — set it in .env');
  }
  if (!config.addonBaseUrl) {
    console.warn('Warning: ADDON_BASE_URL is empty — /streams will return []');
  }
});

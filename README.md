# movie_api

Thin Node.js resolver for KyiKyaMal:

`TMDB id → IMDb id → Stremio-compatible addon → stream list`

## Setup

```bash
cd movie_api
cp .env.example .env
# Edit .env: set TMDB_API_KEY (same key as the Flutter app)
# Optionally set ADDON_BASE_URL to a Stremio-compatible addon origin
npm install
npm run dev
```

## Endpoints

- `GET /health`
- `GET /streams/movie/:tmdbId`
- `GET /streams/tv/:tmdbId?season=1&episode=1`

Without `ADDON_BASE_URL`, stream lists are empty (`[]`) so the Flutter app can fall back to embeds.

## Flutter

Point the app at this API via:

```bash
flutter run --dart-define=STREAM_API_BASE=http://localhost:3000
```

Android emulator host machine: `http://10.0.2.2:3000`  
iOS simulator: `http://localhost:3000`  
Physical device: use your computer's LAN IP.

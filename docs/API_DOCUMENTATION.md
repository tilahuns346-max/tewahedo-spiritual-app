# Mahibere Kidusan / Tewahedo Media - REST API Documentation

Base URL: `/api/v1/`

## Authentication & Users (`/api/v1/auth/`)
- `POST /api/v1/auth/register/` - Register a new user (email, username, password, full_name, language_preference).
- `POST /api/v1/auth/login/` - Login and receive JWT access & refresh tokens.
- `POST /api/v1/auth/refresh/` - Refresh JWT access token.
- `GET  /api/v1/auth/profile/` - Fetch current user profile.
- `PUT  /api/v1/auth/profile/` - Update user profile.

## Spiritual Teachings (`/api/v1/teachings/`)
- `GET  /api/v1/teachings/categories/` - List teaching categories (10 core Tewahedo categories).
- `GET  /api/v1/teachings/lessons/` - List lessons with filters (category, search, is_featured).
- `GET  /api/v1/teachings/lessons/{id}/` - Lesson details (Amharic text, audio URL, video URL, PDF).
- `POST /api/v1/teachings/bookmarks/` - Bookmark a lesson for offline/quick access.

## Sermons & Setatat (`/api/v1/sermons/`)
- `GET  /api/v1/sermons/` - Filterable sermon collection (by preacher, topic, date, scripture).
- `GET  /api/v1/sermons/{id}/` - Detailed sermon entry with audio/video stream links.
- `GET  /api/v1/sermons/preachers/` - List ordained preachers and teachers.

## Kidase / Divine Liturgy (`/api/v1/kidase/`)
- `GET  /api/v1/kidase/anaphoras/` - 14 Anaphoras with liturgical background and audio files.
- `GET  /api/v1/kidase/anaphoras/{id}/sections/` - Verse-by-verse liturgical text with Ge'ez and Amharic translation.

## Wudase Mariam (`/api/v1/wudase/`)
- `GET  /api/v1/wudase/days/` - List the 7 days of praises plus Anqetse Berhan & Yewedeswa.
- `GET  /api/v1/wudase/days/{day_code}/` - Stanzas with Ge'ez, Amharic, and audio timestamp markers.

## Audio Streaming (`/api/v1/audio/`)
- `GET  /api/v1/audio/categories/` - Audio categories (Mezmur, Sebket, Kidase, Wudase Mariam, etc.).
- `GET  /api/v1/audio/tracks/` - Searchable track repository with audio streaming URLs.
- `POST /api/v1/audio/tracks/{id}/increment_play/` - Analytics and play counter.

## Videos (`/api/v1/videos/`)
- `GET  /api/v1/videos/` - Categorized video library (documentaries, liturgical services, teachings).
- `GET  /api/v1/videos/{id}/` - Video details with streaming/YouTube integration.

## Daily Content (`/api/v1/daily/`)
- `GET  /api/v1/daily/today/` - Aggregate daily payload: Today's Saint, Daily Bible Verse, Teaching, Fasting status.
- `GET  /api/v1/daily/calendar/` - Ethiopian liturgical calendar and fast periods.

## User Activity (`/api/v1/activity/`)
- `GET/POST /api/v1/activity/favorites/` - User favorite tracks, lessons, sermons.
- `GET/POST /api/v1/activity/playlists/` - Custom personal playlists.
- `GET/POST /api/v1/activity/history/` - Recently played tracks.
- `GET/POST /api/v1/activity/downloads/` - Download tracker for offline synchronization.

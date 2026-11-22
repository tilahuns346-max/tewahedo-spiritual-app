# Mahibere Kidusan (መሐበረ ቅዱሳን) / Tewahedo Media (ተዋሕዶ ሚዲያ)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Django](https://img.shields.io/badge/Django-5.1-092E20?logo=django)](https://www.djangoproject.com/)
[![React Native](https://img.shields.io/badge/React_Native-Expo-61DAFB?logo=react)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)

An authentic, modern, and comprehensive Ethiopian Orthodox Tewahedo Spiritual Learning, Liturgical Media, and Audio Streaming Platform.

---

## 🌟 Key Features

- **Home Dashboard (የዕለቱ መንፈሳዊ መነሻ)**:
  - Welcome greeting in Amharic & Ge'ez
  - Today's Saint (የዕለቱ ቅዱስ ከስንክሳር)
  - Daily Bible Verse with Orthodox commentary
  - Daily spiritual teaching highlights
  - Fasting calendar reminder (የአጽዋማት መቁጠሪያ)
  - Recently played audio & quick category access

- **Spiritual Teachings (ትምህርተ ተዋሕዶ)**:
  - 10 foundational categories (ስለ እግዚአብሔር፣ ስለ ሥላሴ፣ ስለ ክርስቶስ፣ ስለ መንፈስ ቅዱስ፣ ስለ ቅዱሳን፣ ስለ ቤተክርስቲያን፣ ስለ ምሥጢራት፣ ስለ ጾም፣ ስለ ጸሎት፣ ስለ ንስሐ)
  - Bilingual texts (Amharic & English)
  - Attached audio recitations, video links, and study PDFs

- **Setatat & Sermons (ስብሐታት / ስብከት)**:
  - Comprehensive sermon audio & video repository
  - Search by ordained preacher, liturgical feast, and biblical theme

- **Kidase (ሥርዓተ ቅዳሴ)**:
  - The 14 Anaphoras of the Ethiopian Orthodox Tewahedo Church
  - Ge'ez liturgical texts alongside Amharic translations
  - Audio synchronization with real-time text highlighting
  - Offline reading and liturgical explanations

- **Wudase Mariam (ውዳሴ ማርያም)**:
  - The 7 daily praises (ሰኑይ እስከ እሑድ) + አንቀጸ ብርሃን + ይዌድስዋ መላእክት
  - Parallel Ge'ez and Amharic verses
  - Audio recitation with timestamp markers
  - Font scaling & dark/light reading modes

- **Audio Streaming System (በድምፅ)**:
  - Professional player inspired by modern streaming apps
  - Persistent mini-player at the bottom
  - Mezmurs, Sermons, Kidase, Liturgical chants, and Prayers
  - Background playback & lock-screen controls
  - Playback speed (0.75x to 2x), repeat, shuffle, seeking
  - Personal playlists, favorites, and offline download caching

- **Synaxarium & Daily Calendar (ስንክሳርና የቤተክርስቲያን ቀን መቁጠሪያ)**:
  - Ethiopian Orthodox calendar conversion (13 months)
  - Daily saint commemorations and biographies
  - Fasting seasons (ዐቢይ ጾም፣ ጾመ ፍልሰታ፣ ጾመ ነቢያት...)

---

## 🛠️ Tech Stack

- **Mobile & Web**: React Native, Expo Router, TypeScript, NativeWind / Tailwind CSS, Expo AV.
- **Backend API**: Python 3.12, Django 5.1, Django REST Framework, SimpleJWT, Django Filter, Pillow.
- **Database**: PostgreSQL (Production) / SQLite3 (Development).
- **Authentication**: JWT (JSON Web Tokens) with role-based access control.
- **Containerization**: Docker & Docker Compose.

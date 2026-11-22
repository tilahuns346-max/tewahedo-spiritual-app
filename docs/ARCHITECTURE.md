# Mahibere Kidusan (መሐበረ ቅዱሳን) - System Architecture

## Overview
**Mahibere Kidusan (Tewahedo Media)** is an enterprise-grade spiritual learning and multimedia platform for the Ethiopian Orthodox Tewahedo Church. The platform empowers believers across the world to access authentic liturgical texts, Ge'ez and Amharic prayers, sermons, mezmurs, spiritual teachings, daily saints (Synaxarium), and church calendar feeds.

```
       +--------------------------------------------------------------+
       |               React Native Mobile & Web Client               |
       |       (Expo Router / TypeScript / Audio Streaming Engine)    |
       +--------------------------------------------------------------+
                                      |
                           HTTPS / REST / JWT
                                      |
       +--------------------------------------------------------------+
       |                 Django REST Framework Backend                |
       |  - accounts        - teachings       - sermons    - kidase   |
       |  - wudase_mariam   - audio           - videos     - prayers  |
       |  - saints          - daily_content   - activity   - downloads|
       +--------------------------------------------------------------+
                     |                                |
       +-----------------------------+  +-----------------------------+
       |    PostgreSQL Database      |  |  Cloud Media (S3 / Cloud)   |
       |   (Relational / Ge'ez Full) |  |   (HLS Audio / Cover Art)   |
       +-----------------------------+  +-----------------------------+
```

## Architectural Principles
1. **Authenticity & Integrity**: Liturgical texts (Kidase, Wudase Mariam, Daily Prayers) follow strict Ethiopian Orthodox Tewahedo canonical tradition, with Ge'ez and Amharic side-by-side or verse-by-verse alignment.
2. **Offline-First Audio & Text**: Believers in areas with low connectivity can download audios, Wudase Mariam, and liturgical books for full offline playback and reading.
3. **Continuous Audio Playback**: Background audio with lock-screen controls, seekbar, playlist management, shuffle, repeat, and speed regulation.
4. **Bilingual & Multi-script Support**: Seamless rendering of Fidel (Ethiopic script) in Ge'ez and Amharic alongside English.
5. **Role-Based Access Control**: Super Admins, Content Managers, Liturgical Editors, and Normal Users.

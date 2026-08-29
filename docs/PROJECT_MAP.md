# Project map

**English** | [Русский](ru/PROJECT_MAP.md)

Feature-first layout for WeatherLens. Keep modules small and replaceable.

> Keep this file current. Structural changes belong here first so the next task can start from the map instead of scanning the whole repo.

## Tree

```
WeatherLens/
├── App.tsx                 # Expo entry → AppRoot
├── README.md               # EN (primary)
├── README.ru.md            # RU mirror
├── assets/                 # Icons, splash, Lottie
├── docs/                   # Public docs (EN)
│   └── ru/                 # Public docs (RU mirrors)
├── src/
│   ├── app/                # Root providers + navigation
│   ├── core/               # Config, HTTP, theme
│   ├── features/
│   │   ├── weather/        # Today + forecast
│   │   ├── map/            # Interactive map + pins
│   │   ├── favorites/      # Saved locations
│   │   ├── compare/        # Side-by-side cities
│   │   ├── location/       # Permissions + GPS
│   │   └── widget/         # Home-screen widget
│   └── shared/             # Reusable UI kit
└── .env.example
```

## Features

| Feature | Responsibility | Public export |
|---------|----------------|---------------|
| `weather` | Current/hourly forecast, units, Lottie, geocoding helpers, `fetchWeatherBundle`, `usePlaceSearch` | `TodayScreen`, `HourlyStrip`, `WeatherIcon`, `useWeatherStore`, `usePlaceSearch`, `searchPlaces`, `reverseGeocode`, `fetchWeatherBundle` |
| `map` | Map, tap-to-pick pin, city search (OSM/Leaflet) | `MapScreen` |
| `favorites` | Persist saved places | `FavoritesScreen`, `FavoriteToggle`, `useFavoritesStore`, `isSameLocation` |
| `compare` | Two independent weather slots (A/B) with lifecycle-safe state machine | `CompareScreen` |
| `location` | Geo permissions & current position | `getCurrentPosition`, `getLastKnownPosition`, `openAppSettings` |
| `widget` | Home screen widget bridge | Phase 4 |

## Core

| Module | Role |
|--------|------|
| `core/config` | Env / API key access |
| `core/http` | Axios client + normalized errors |
| `core/theme` | Light/dark tokens, preference store, `ThemeModeToggle` |
| `app/settings` | Header gear (right) + Appearance drawer sliding in from the right |

## Conventions

- New capability → new folder under `src/features/<name>/` with `ui/`, `model/`, optional `api/`, and `index.ts`.
- Cross-feature imports only through `index.ts`.
- Shared UI only in `src/shared` when reused by 2+ features.

## Docs languages

| EN (source of truth) | RU mirror |
|----------------------|-----------|
| [README.md](../README.md) | [README.ru.md](../README.ru.md) |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | [ru/ARCHITECTURE.md](ru/ARCHITECTURE.md) |
| [ROADMAP.md](./ROADMAP.md) | [ru/ROADMAP.md](ru/ROADMAP.md) |
| [PROJECT_MAP.md](./PROJECT_MAP.md) | [ru/PROJECT_MAP.md](ru/PROJECT_MAP.md) |

## Related

- Product roadmap: [ROADMAP.md](./ROADMAP.md)
- Architecture notes: [ARCHITECTURE.md](./ARCHITECTURE.md)

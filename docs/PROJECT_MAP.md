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
| `weather` | Current/hourly forecast, units | `TodayScreen`, `useWeatherStore` |
| `map` | Map, drag pin, coordinate pick | `MapScreen` |
| `favorites` | Persist saved places | `FavoritesScreen`, `useFavoritesStore` |
| `compare` | Two-city comparison | `CompareScreen` |
| `location` | Geo permissions & current position | helpers (Phase 1+) |
| `widget` | Home screen widget bridge | Phase 4 |

## Core

| Module | Role |
|--------|------|
| `core/config` | Env / API key access |
| `core/http` | Axios client + normalized errors |
| `core/theme` | Light/dark tokens + provider |

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

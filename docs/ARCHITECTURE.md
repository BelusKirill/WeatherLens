# Architecture

**English** | [Русский](ru/ARCHITECTURE.md)

## Goals

- Easy to extend: add a feature without touching unrelated modules
- Clear data flow for REST + location-driven UI
- Portfolio-readable structure (recruiters can scan `src/features`)

## Style

**Feature-first** with a thin `core` and `shared` layer.

```
UI (feature/ui)
  → store / hooks (feature/model)
    → feature api (optional)
      → core/http (Axios)
        → OpenWeather
```

Domain types live in `feature/model`. API DTOs stay in `api/` or mappers and are not passed into presentational components.

## State

Zustand stores own feature state:

- `weatherStore` — selected location, forecast, units, request status
- `favoritesStore` — saved locations (persisted)
- `compareStore` — two independent weather slots with per-slot request state
- `themePreferenceStore` — persisted system / light / dark preference

## Navigation

Bottom tabs in `src/app/navigation`: Today · Map · Favorites · Compare.

## Extensibility examples

| Change | Where |
|--------|-------|
| New screen in existing area | `features/<name>/ui` + navigator |
| New product capability | new `features/<name>` module |
| New weather provider | swap `features/weather/api` + keep domain types |
| Design tokens | `core/theme` |

## Out of scope for v1

Full Clean Architecture (Domain/Data/Presentation packages) is reserved for a later portfolio project; WeatherLens stays pragmatic and modular.

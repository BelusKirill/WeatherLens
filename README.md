# WeatherLens

**English** | [Русский](README.ru.md)

Mobile weather app built as a portfolio product: live Today forecast from OpenWeather, geolocation, an interactive map, saved places, and a feature-first React Native architecture. City compare and a home-screen widget are on the roadmap.

## Highlights

- **Today forecast** — live current conditions, 3-hour strip, °C/°F, loading/error/empty UX
- **Animated icons** — Lottie states for clear / clouds / rain
- **Location flow** — permission handling with settings deep link and a demo city fallback
- **Interactive map** — tap a place or search a city, reverse geocode, load weather
- **City compare** — two locations, one screen (planned)
- **Favorites** — saved places persist across restarts
- **Home-screen widget** — glanceable conditions (planned)

## Stack

| Layer | Choice |
|-------|--------|
| App | React Native (Expo) + TypeScript |
| State | Zustand |
| Networking | Axios → OpenWeather API |
| Maps | OpenStreetMap via Leaflet |
| Location | expo-location |
| Motion | Reanimated + Lottie |

## Project structure

```
src/
  app/         # providers, navigation
  core/        # config, http, theme
  features/    # weather · map · favorites · compare · location · widget
  shared/      # reusable UI
```

See [PROJECT_MAP](docs/PROJECT_MAP.md) · [ARCHITECTURE](docs/ARCHITECTURE.md)  
Other language: [docs/ru/](docs/ru/)

## Skills demonstrated

- REST clients, async flows, and resilient error/loading UX
- Geolocation permissions and graceful denial / settings recovery
- Maps: OpenStreetMap, tap-to-pick pin, reverse geocode, and city search
- Feature-first architecture that stays easy to extend
- Cross-platform UI with theming and Lottie motion
- Product roadmap: compare and a home-screen widget as differentiators

## Getting started

```bash
npm install
cp .env.example .env
# set EXPO_PUBLIC_OPENWEATHER_API_KEY in .env
npm start
```

Requires an [OpenWeather](https://openweathermap.org/api) API key.

### Run targets

| Target | How |
|--------|-----|
| **Android emulator (primary)** | Start an AVD, then `npm start` → press `a` (or `npm run android`) |
| **Physical device** | Install Expo Go, same Wi‑Fi as the PC, `npm start` → scan QR (`npx expo start --tunnel` if LAN fails) |
| **Web** | `npm run web` — navigation/theme plus Leaflet map; device GPS is limited |
| **iOS Simulator** | Requires macOS — planned |

Expo Fast Refresh updates the app as you edit `src/`.

## Roadmap

[ROADMAP](docs/ROADMAP.md) · [RU](docs/ru/ROADMAP.md)

## License

MIT — see [LICENSE](LICENSE).

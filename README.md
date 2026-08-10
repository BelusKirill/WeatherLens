# WeatherLens

**English** | [Русский](README.ru.md)

Mobile weather app for exploring the world on a map — not just checking your current city.

Pin any place, save favorites, compare two cities side-by-side, and browse an animated hourly forecast. Built as a portfolio product showcasing maps, geolocation, REST, and polished React Native UI.

## Highlights

- **Interactive map** — drag a pin to load weather for any coordinates
- **Hourly forecast** — custom animated weather icons
- **City compare** — two locations, one screen
- **Favorites** — quick access to saved places
- **Home-screen widget** — glanceable conditions (planned)

## Stack

| Layer | Choice |
|-------|--------|
| App | React Native (Expo) + TypeScript |
| State | Zustand |
| Networking | Axios → OpenWeather API |
| Maps | react-native-maps |
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
- Geolocation permissions and map-driven interaction
- Feature-first architecture that stays easy to extend
- Cross-platform UI with theming and motion-ready setup
- Product thinking: compare, favorites, and widget as differentiators

## Getting started

```bash
npm install
cp .env.example .env
# set EXPO_PUBLIC_OPENWEATHER_API_KEY in .env
npm start
```

Requires an [OpenWeather](https://openweathermap.org/api) API key.

## Roadmap

[ROADMAP](docs/ROADMAP.md) · [RU](docs/ru/ROADMAP.md)

## License

MIT — see [LICENSE](LICENSE).

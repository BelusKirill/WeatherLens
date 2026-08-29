# WeatherLens

[English](README.md) | **Русский**

Мобильное приложение погоды как портфолио-продукт: живой экран Today через OpenWeather, геолокация, интерактивная карта, сохранённые места, сравнение городов side-by-side и feature-first архитектура на React Native. Виджет домашнего экрана — в roadmap.

## Highlights

- **Today forecast** — текущие условия, полоска каждые 3 часа, °C/°F, UX loading/error/empty
- **Animated icons** — Lottie-состояния clear / clouds / rain
- **Location flow** — permissions, переход в настройки и demo-город как fallback
- **Interactive map** — тап по месту или поиск города, reverse geocode, загрузка погоды
- **City compare** — две независимые локации рядом, без замены Today
- **Favorites** — сохранённые места переживают перезапуск
- **Light / dark** — system, light или dark из панели настроек (шестерёнка в header)
- **Home-screen widget** — погода с первого взгляда (planned)

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

См. [PROJECT_MAP](docs/ru/PROJECT_MAP.md) · [ARCHITECTURE](docs/ru/ARCHITECTURE.md)  
Other language: [docs/](docs/)

## Skills demonstrated

- REST-клиенты, async-потоки и устойчивый error/loading UX
- Геолокация, permissions и восстановление через системные настройки
- Карта: OpenStreetMap, tap-to-pick пин, reverse geocode и поиск города
- Параллельная загрузка погоды для side-by-side compare
- Feature-first архитектура, которую легко расширять
- Кроссплатформенный UI с темой, Reanimated и Lottie
- Продуктовый roadmap: виджет домашнего экрана как следующий дифференциатор

## Getting started

```bash
npm install
cp .env.example .env
# set EXPO_PUBLIC_OPENWEATHER_API_KEY in .env
npm start
```

Нужен API-ключ [OpenWeather](https://openweathermap.org/api).

### Run targets

| Target | How |
|--------|-----|
| **Android emulator (primary)** | Запустить AVD, затем `npm start` → `a` (или `npm run android`) |
| **Physical device** | Expo Go, одна Wi‑Fi с ПК, `npm start` → QR (`npx expo start --tunnel`, если LAN не видит) |
| **Web** | `npm run web` — навигация/тема и Leaflet-карта; GPS устройства ограничен |
| **iOS Simulator** | Нужен macOS — planned |

Expo Fast Refresh обновляет приложение при правках в `src/`.

## Roadmap

[ROADMAP](docs/ru/ROADMAP.md) · [EN](docs/ROADMAP.md)

## License

MIT — см. [LICENSE](LICENSE).

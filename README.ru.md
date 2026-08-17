# WeatherLens

[English](README.md) | **Русский**

Мобильное приложение погоды как портфолио-продукт: живой экран Today через OpenWeather, геолокация и feature-first архитектура на React Native. Пин на карте, избранное, compare и виджет домашнего экрана — в roadmap.

## Highlights

- **Today forecast** — текущие условия, полоска каждые 3 часа, °C/°F, UX loading/error/empty
- **Animated icons** — Lottie-состояния clear / clouds / rain
- **Location flow** — permissions, переход в настройки и demo-город как fallback
- **Interactive map** — перетащите пин для любых координат (next)
- **City compare** — две локации на одном экране (planned)
- **Favorites** — сохранённые места (planned)
- **Home-screen widget** — погода с первого взгляда (planned)

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

См. [PROJECT_MAP](docs/ru/PROJECT_MAP.md) · [ARCHITECTURE](docs/ru/ARCHITECTURE.md)  
Other language: [docs/](docs/)

## Skills demonstrated

- REST-клиенты, async-потоки и устойчивый error/loading UX
- Геолокация, permissions и восстановление через системные настройки
- Feature-first архитектура, которую легко расширять
- Кроссплатформенный UI с темой и Lottie-анимацией
- Продуктовый roadmap: map pin, compare, favorites и widget как дифференциаторы

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
| **Web (UI shell only)** | `npm run web` — превью навигации/темы; карта и геолокация ограничены |
| **iOS Simulator** | Нужен macOS — planned |

Expo Fast Refresh обновляет приложение при правках в `src/`.

## Roadmap

[ROADMAP](docs/ru/ROADMAP.md) · [EN](docs/ROADMAP.md)

## License

MIT — см. [LICENSE](LICENSE).

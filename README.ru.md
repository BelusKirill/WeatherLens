# WeatherLens

[English](README.md) | **Русский**

Мобильное приложение погоды для исследования мира на карте — не только проверка текущего города.

Поставьте пин в любом месте, сохраните избранное, сравните два города side-by-side и просмотрите анимированный почасовой прогноз. Портфолио-продукт: карты, геолокация, REST и аккуратный React Native UI.

## Highlights

- **Interactive map** — перетащите пин, чтобы загрузить погоду по координатам
- **Hourly forecast** — кастомные анимированные иконки погоды
- **City compare** — две локации на одном экране
- **Favorites** — быстрый доступ к сохранённым местам
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
- Геолокация, permissions и взаимодействие через карту
- Feature-first архитектура, которую легко расширять
- Кроссплатформенный UI с темой и готовностью к анимациям
- Продуктовое мышление: compare, favorites и widget как дифференциаторы

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

# Карта проекта

[English](../PROJECT_MAP.md) | **Русский**

Feature-first раскладка WeatherLens. Модули — маленькие и заменяемые.

> Держите файл актуальным. Структурные изменения фиксируйте здесь в первую очередь — следующая задача должна начинаться с карты, а не со сканирования всего репозитория.

## Дерево

```
WeatherLens/
├── App.tsx                 # Точка входа Expo → AppRoot
├── README.md               # EN (основной)
├── README.ru.md            # RU-зеркало
├── assets/                 # Иконки, splash, Lottie
├── docs/                   # Публичные docs (EN)
│   └── ru/                 # Публичные docs (RU-зеркала)
├── src/
│   ├── app/                # Корневые провайдеры + навигация
│   ├── core/               # Config, HTTP, theme
│   ├── features/
│   │   ├── weather/        # Today + прогноз
│   │   ├── map/            # Интерактивная карта + пины
│   │   ├── favorites/      # Сохранённые локации
│   │   ├── compare/        # Сравнение городов
│   │   ├── location/       # Permissions + GPS
│   │   └── widget/         # Виджет домашнего экрана
│   └── shared/             # Переиспользуемый UI-kit
└── .env.example
```

## Фичи

| Фича | Ответственность | Публичный экспорт |
|------|-----------------|-------------------|
| `weather` | Текущий/почасовой прогноз, единицы, Lottie, геокодинг | `TodayScreen`, `useWeatherStore`, `searchPlaces`, `reverseGeocode` |
| `map` | Карта, tap-to-pick пин, поиск города (OSM/Leaflet) | `MapScreen` |
| `favorites` | Persist сохранённых мест | `FavoritesScreen`, `FavoriteToggle`, `useFavoritesStore` |
| `compare` | Сравнение двух городов | `CompareScreen` |
| `location` | Geo permissions и текущая позиция | `getCurrentPosition`, `getLastKnownPosition`, `openAppSettings` |
| `widget` | Мост к виджету home screen | Phase 4 |

## Core

| Модуль | Роль |
|--------|------|
| `core/config` | Env / доступ к API-ключу |
| `core/http` | Axios-клиент + нормализованные ошибки |
| `core/theme` | Токены light/dark + provider |

## Соглашения

- Новая возможность → новая папка `src/features/<name>/` с `ui/`, `model/`, опционально `api/`, и `index.ts`.
- Кросс-feature импорты только через `index.ts`.
- Shared UI только в `src/shared`, если используется 2+ фичами.

## Языки документации

| EN (источник истины) | RU-зеркало |
|----------------------|------------|
| [README.md](../../README.md) | [README.ru.md](../../README.ru.md) |
| [ARCHITECTURE.md](../ARCHITECTURE.md) | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| [ROADMAP.md](../ROADMAP.md) | [ROADMAP.md](./ROADMAP.md) |
| [PROJECT_MAP.md](../PROJECT_MAP.md) | [PROJECT_MAP.md](./PROJECT_MAP.md) |

## Связанные документы

- Roadmap продукта: [ROADMAP.md](./ROADMAP.md)
- Архитектура: [ARCHITECTURE.md](./ARCHITECTURE.md)

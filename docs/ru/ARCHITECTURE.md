# Архитектура

[English](../ARCHITECTURE.md) | **Русский**

## Цели

- Легко расширять: добавлять фичу, не трогая чужие модули
- Понятный поток данных для REST + UI на основе локации
- Структура, читаемая в портфолио (рекрутер может пройтись по `src/features`)

## Стиль

**Feature-first** с тонким слоем `core` и `shared`.

```
UI (feature/ui)
  → store / hooks (feature/model)
    → feature api (опционально)
      → core/http (Axios)
        → OpenWeather
```

Domain-типы живут в `feature/model`. DTO API остаются в `api/` или мапперах и не попадают в презентационные компоненты.

## Состояние

Zustand-сторы владеют состоянием фичи:

- `weatherStore` — выбранная локация, прогноз, единицы, статус запроса
- `favoritesStore` — сохранённые локации (persist)
- выбор для compare — в фиче `compare`, когда появится

## Навигация

Bottom tabs в `src/app/navigation`: Today · Map · Favorites · Compare.

## Примеры расширения

| Изменение | Куда |
|-----------|------|
| Новый экран в существующей зоне | `features/<name>/ui` + navigator |
| Новая продуктовая возможность | новый модуль `features/<name>` |
| Другой провайдер погоды | заменить `features/weather/api`, сохранить domain-типы |
| Design tokens | `core/theme` |

## Вне scope v1

Полный Clean Architecture (пакеты Domain/Data/Presentation) — для более позднего портфолио-проекта; WeatherLens остаётся прагматичным и модульным.

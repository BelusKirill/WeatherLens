import { EmptyState, Screen } from '@/shared/ui';

import { useFavoritesStore } from '../model/favoritesStore';

export function FavoritesScreen() {
  const items = useFavoritesStore((state) => state.items);

  return (
    <Screen>
      <EmptyState
        title="Favorites"
        subtitle={
          items.length === 0
            ? 'Saved locations will appear here for quick access.'
            : `${items.length} saved location(s). List UI comes next.`
        }
      />
    </Screen>
  );
}

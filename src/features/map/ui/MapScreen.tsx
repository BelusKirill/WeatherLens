import { EmptyState, Screen } from '@/shared/ui';

export function MapScreen() {
  return (
    <Screen>
      <EmptyState
        title="Map"
        subtitle="Interactive map with drag-and-drop pins will live here (react-native-maps)."
      />
    </Screen>
  );
}

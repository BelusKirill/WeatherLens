import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { CompareScreen } from '@/features/compare';
import { FavoritesScreen } from '@/features/favorites';
import { MapScreen } from '@/features/map';
import { TodayScreen } from '@/features/weather';
import { useAppTheme } from '@/core/theme';

import type { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootNavigator() {
  const theme = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.text,
        tabBarStyle: { backgroundColor: theme.colors.surface },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textMuted,
      }}
    >
      <Tab.Screen name="Today" component={TodayScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Compare" component={CompareScreen} />
    </Tab.Navigator>
  );
}

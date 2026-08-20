import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAppTheme } from '@/core/theme';
import { CompareScreen } from '@/features/compare';
import { FavoritesScreen } from '@/features/favorites';
import { MapScreen } from '@/features/map';
import {
  TodayScreen,
  useWeatherStore,
  type WeatherLocation,
} from '@/features/weather';

import type { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

function FavoritesRoute({
  navigation,
}: BottomTabScreenProps<RootTabParamList, 'Favorites'>) {
  const handleOpen = async (location: WeatherLocation) => {
    const store = useWeatherStore.getState();
    await store.loadWeather({
      lat: location.lat,
      lon: location.lon,
      name: location.name,
      force: true,
    });
    const { status, errorMessage, current } = useWeatherStore.getState();
    if (status === 'error') {
      throw new Error(errorMessage ?? 'Could not load weather. Try again.');
    }
    if (status !== 'ready' && !(status === 'loading' && current)) {
      throw new Error('Could not open this place.');
    }
    navigation.navigate('Today');
  };

  return <FavoritesScreen onOpenLocation={handleOpen} />;
}

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
      <Tab.Screen name="Favorites" component={FavoritesRoute} />
      <Tab.Screen name="Compare" component={CompareScreen} />
    </Tab.Navigator>
  );
}

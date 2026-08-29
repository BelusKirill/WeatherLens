import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useAppColorScheme } from '@/core/theme';

import { RootNavigator } from './navigation/RootNavigator';
import { AppThemeProvider } from './providers/AppThemeProvider';
import { SettingsProvider } from './settings/SettingsContext';
import { SettingsDrawer } from './settings/SettingsDrawer';

export function AppRoot() {
  return (
    <SafeAreaProvider>
      <AppThemeProvider>
        <SettingsProvider>
          <NavigationContainer>
            <ThemedStatusBar />
            <RootNavigator />
            <SettingsDrawer />
          </NavigationContainer>
        </SettingsProvider>
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}

function ThemedStatusBar() {
  const colorScheme = useAppColorScheme();
  return <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />;
}

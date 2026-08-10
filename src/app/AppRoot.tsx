import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from './navigation/RootNavigator';
import { AppThemeProvider } from './providers/AppThemeProvider';

export function AppRoot() {
  return (
    <SafeAreaProvider>
      <AppThemeProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <RootNavigator />
        </NavigationContainer>
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}

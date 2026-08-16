import * as Location from 'expo-location';
import { Linking } from 'react-native';

import type {
  Coords,
  CurrentPositionResult,
  LocationPermissionStatus,
} from '../model/types';

export async function getForegroundPermissionStatus(): Promise<LocationPermissionStatus> {
  const { status } = await Location.getForegroundPermissionsAsync();
  return mapPermissionStatus(status);
}

export async function requestForegroundPermissions(): Promise<LocationPermissionStatus> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return mapPermissionStatus(status);
}

export async function getCurrentPosition(): Promise<CurrentPositionResult> {
  const servicesEnabled = await Location.hasServicesEnabledAsync();
  if (!servicesEnabled) {
    return {
      ok: false,
      reason: 'services_off',
      message:
        'Location services are turned off. Enable them in system settings to load local weather.',
    };
  }

  let permission = await getForegroundPermissionStatus();
  if (permission === 'undetermined') {
    permission = await requestForegroundPermissions();
  }

  if (permission !== 'granted') {
    return {
      ok: false,
      reason: 'denied',
      message:
        'Location access is off. Enable it in system settings, then try again.',
    };
  }

  try {
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const coords: Coords = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    };

    return { ok: true, coords };
  } catch {
    return {
      ok: false,
      reason: 'unavailable',
      message: 'Could not read your current position. Try again.',
    };
  }
}

/** Opens OS app settings so the user can re-enable a permanently denied permission. */
export async function openAppSettings(): Promise<void> {
  await Linking.openSettings();
}

function mapPermissionStatus(
  status: Location.PermissionStatus,
): LocationPermissionStatus {
  if (status === Location.PermissionStatus.GRANTED) {
    return 'granted';
  }
  if (status === Location.PermissionStatus.DENIED) {
    return 'denied';
  }
  return 'undetermined';
}

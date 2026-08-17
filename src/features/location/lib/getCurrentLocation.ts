import * as Location from 'expo-location';
import { Linking } from 'react-native';

import type {
  Coords,
  CurrentPositionResult,
  LocationPermissionStatus,
} from '../model/types';

/** Fail closed if the OS never returns a fix (avoids eternal Today spinner). */
const GPS_TIMEOUT_MS = 10_000;

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
    const position = await withTimeout(
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      }),
      GPS_TIMEOUT_MS,
    );

    const coords: Coords = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    };

    return { ok: true, coords };
  } catch (error) {
    if (error instanceof Error && error.message === 'location_timeout') {
      return {
        ok: false,
        reason: 'timeout',
        message:
          'Locating timed out. Move to an open area, check GPS, or try the demo city.',
      };
    }

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

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('location_timeout'));
    }, ms);

    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
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

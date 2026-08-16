export type Coords = {
  lat: number;
  lon: number;
};

export type LocationPermissionStatus =
  | 'granted'
  | 'denied'
  | 'undetermined';

export type CurrentPositionResult =
  | { ok: true; coords: Coords }
  | {
      ok: false;
      reason: 'denied' | 'unavailable' | 'services_off';
      message: string;
    };

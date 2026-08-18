import type { MapPin } from '../model/camera';

export type MapCanvasProps = {
  pin: MapPin;
  onPick: (lat: number, lon: number) => void | Promise<void>;
};

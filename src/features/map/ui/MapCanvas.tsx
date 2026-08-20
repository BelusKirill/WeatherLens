import { createElement, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

import { isSameMapPoint } from '../model/camera';
import {
  buildOsmLeafletHtml,
  parseMapBridgeMessage,
} from './osmLeaflet';
import type { MapCanvasProps } from './MapCanvas.types';

export function MapCanvas({ pin, onPick }: MapCanvasProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const lastPickRef = useRef<{ lat: number; lon: number } | null>(null);
  const htmlRef = useRef(buildOsmLeafletHtml(pin.lat, pin.lon));

  useEffect(() => {
    const onWindowMessage = (event: { data: unknown }) => {
      if (typeof event.data !== 'string') {
        return;
      }
      const message = parseMapBridgeMessage(event.data);
      if (message?.type === 'pick') {
        lastPickRef.current = { lat: message.lat, lon: message.lon };
        onPick(message.lat, message.lon);
      }
    };
    window.addEventListener('message', onWindowMessage);
    return () => window.removeEventListener('message', onWindowMessage);
  }, [onPick]);

  useEffect(() => {
    if (lastPickRef.current && isSameMapPoint(lastPickRef.current, pin)) {
      return;
    }
    frameRef.current?.contentWindow?.postMessage(
      JSON.stringify({
        type: 'pin',
        lat: pin.lat,
        lon: pin.lon,
        animate: true,
      }),
      '*',
    );
  }, [pin.lat, pin.lon]);

  return (
    <View style={styles.host}>
      {createElement('iframe', {
        ref: frameRef,
        title: 'Weather map',
        srcDoc: htmlRef.current,
        style: {
          border: 'none',
          width: '100%',
          height: '100%',
        },
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    flex: 1,
    backgroundColor: '#E8EEF5',
  },
});

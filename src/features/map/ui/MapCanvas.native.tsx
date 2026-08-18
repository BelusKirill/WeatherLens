import { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

import { isSameMapPoint } from '../model/camera';
import {
  applyPinScript,
  buildOsmLeafletHtml,
  parseMapBridgeMessage,
} from './osmLeaflet';
import type { MapCanvasProps } from './MapCanvas.types';

export function MapCanvas({ pin, onPick }: MapCanvasProps) {
  const webRef = useRef<WebView>(null);
  const readyRef = useRef(false);
  const pinRef = useRef(pin);
  pinRef.current = pin;
  const lastPickRef = useRef<{ lat: number; lon: number } | null>(null);
  const htmlRef = useRef(buildOsmLeafletHtml(pin.lat, pin.lon));

  useEffect(() => {
    if (!readyRef.current) {
      return;
    }
    if (lastPickRef.current && isSameMapPoint(lastPickRef.current, pin)) {
      return;
    }
    webRef.current?.injectJavaScript(applyPinScript(pin.lat, pin.lon, true));
  }, [pin.lat, pin.lon]);

  const onMessage = (event: WebViewMessageEvent) => {
    const message = parseMapBridgeMessage(event.nativeEvent.data);
    if (!message) {
      return;
    }
    if (message.type === 'ready') {
      readyRef.current = true;
      const current = pinRef.current;
      webRef.current?.injectJavaScript(
        applyPinScript(current.lat, current.lon, false),
      );
      return;
    }
    lastPickRef.current = { lat: message.lat, lon: message.lon };
    onPick(message.lat, message.lon);
  };

  return (
    <WebView
      ref={webRef}
      source={{ html: htmlRef.current, baseUrl: 'https://basemaps.cartocdn.com/' }}
      originWhitelist={['*']}
      javaScriptEnabled
      domStorageEnabled
      mixedContentMode="always"
      setSupportMultipleWindows={false}
      androidLayerType="hardware"
      style={styles.webview}
      onMessage={onMessage}
    />
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: '#E8EEF5',
  },
});

import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

import { useAppTheme } from '@/core/theme';

import { isSameMapPoint } from '../model/camera';
import {
  applyPinScript,
  buildOsmLeafletHtml,
  isAllowedMapUrl,
  parseMapBridgeMessage,
} from './osmLeaflet';
import type { MapCanvasProps } from './MapCanvas.types';

export function MapCanvas({ pin, onPick }: MapCanvasProps) {
  const theme = useAppTheme();
  const webRef = useRef<WebView>(null);
  const readyRef = useRef(false);
  const pinRef = useRef(pin);
  pinRef.current = pin;
  const lastPickRef = useRef<{ lat: number; lon: number } | null>(null);
  const htmlRef = useRef(buildOsmLeafletHtml(pin.lat, pin.lon));
  const [failed, setFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

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

  if (failed) {
    return (
      <View style={[styles.failed, { backgroundColor: theme.colors.surface }]}>
        <Text style={{ color: theme.colors.text, textAlign: 'center' }}>
          Couldn’t load the map. Check your connection and try again.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            readyRef.current = false;
            setFailed(false);
            setReloadKey((key) => key + 1);
          }}
          style={[styles.retry, { borderColor: theme.colors.border }]}
        >
          <Text style={{ color: theme.colors.accent, fontWeight: '600' }}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <WebView
      key={reloadKey}
      ref={webRef}
      source={{ html: htmlRef.current, baseUrl: 'https://basemaps.cartocdn.com/' }}
      originWhitelist={['https://*', 'about:*']}
      javaScriptEnabled
      domStorageEnabled
      mixedContentMode="never"
      setSupportMultipleWindows={false}
      androidLayerType="hardware"
      style={styles.webview}
      onMessage={onMessage}
      onError={() => setFailed(true)}
      onShouldStartLoadWithRequest={(request) => isAllowedMapUrl(request.url)}
    />
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: '#E8EEF5',
  },
  failed: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    padding: 24,
  },
  retry: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
});

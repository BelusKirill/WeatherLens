export type MapBridgeMessage =
  | { type: 'ready' }
  | { type: 'pick'; lat: number; lon: number };

export function parseMapBridgeMessage(raw: string): MapBridgeMessage | null {
  try {
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== 'object') {
      return null;
    }
    const message = data as { type?: unknown; lat?: unknown; lon?: unknown };
    if (message.type === 'ready') {
      return { type: 'ready' };
    }
    if (
      message.type === 'pick' &&
      typeof message.lat === 'number' &&
      typeof message.lon === 'number' &&
      Number.isFinite(message.lat) &&
      Number.isFinite(message.lon)
    ) {
      return { type: 'pick', lat: message.lat, lon: message.lon };
    }
    return null;
  } catch {
    return null;
  }
}

export function applyPinScript(lat: number, lon: number, animate: boolean): string {
  const safeLat = Number(lat.toFixed(6));
  const safeLon = Number(lon.toFixed(6));
  return `window.applyPin(${safeLat},${safeLon},${animate ? 'true' : 'false'});true;`;
}

/** Leaflet + OSM/CARTO HTML. Numbers only — never interpolate free text. */
export function buildOsmLeafletHtml(lat: number, lon: number): string {
  const safeLat = Number(lat.toFixed(6));
  const safeLon = Number(lon.toFixed(6));

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    html,body,#map{height:100%;margin:0;padding:0;background:#e8eef5}
    .leaflet-control-attribution{display:none}
    .leaflet-bottom.leaflet-right{bottom:108px;right:10px}
    .leaflet-control-zoom a{width:36px;height:36px;line-height:36px;font-size:18px}
    .wl-pin{background:none;border:none}
    .wl-pin-body{
      width:22px;height:22px;margin:4px auto 0;
      background:#1F6FEB;border:3px solid #fff;
      border-radius:50% 50% 50% 0;transform:rotate(-45deg);
      box-shadow:0 2px 8px rgba(11,31,51,.35);
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    function send(payload) {
      var json = JSON.stringify(payload);
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(json);
      } else if (window.parent && window.parent !== window) {
        window.parent.postMessage(json, '*');
      }
    }
    function applyPin(lat, lon, animate) {
      marker.setLatLng([lat, lon]);
      if (animate) {
        map.flyTo([lat, lon], Math.max(map.getZoom(), 12), { duration: 0.4 });
      } else {
        map.setView([lat, lon], map.getZoom());
      }
    }
    window.applyPin = applyPin;
    var map = L.map('map', { zoomControl: false, attributionControl: false })
      .setView([${safeLat}, ${safeLon}], 12);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.tileLayer('https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);
    var pinIcon = L.divIcon({
      className: 'wl-pin',
      html: '<div class="wl-pin-body"></div>',
      iconSize: [30, 42],
      iconAnchor: [15, 38]
    });
    var marker = L.marker([${safeLat}, ${safeLon}], {
      icon: pinIcon,
      interactive: false
    }).addTo(map);
    map.on('click', function (event) {
      marker.setLatLng(event.latlng);
      send({ type: 'pick', lat: event.latlng.lat, lon: event.latlng.lng });
    });
    function onMsg(event) {
      try {
        var data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data && data.type === 'pin') {
          applyPin(data.lat, data.lon, !!data.animate);
        }
      } catch (err) {}
    }
    document.addEventListener('message', onMsg);
    window.addEventListener('message', onMsg);
    map.whenReady(function () { send({ type: 'ready' }); });
  </script>
</body>
</html>`;
}

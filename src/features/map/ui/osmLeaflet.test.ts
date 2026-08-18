import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isAllowedMapUrl, parseMapBridgeMessage } from '../ui/osmLeaflet';

describe('parseMapBridgeMessage', () => {
  it('accepts ready and pick payloads', () => {
    assert.deepEqual(parseMapBridgeMessage('{"type":"ready"}'), { type: 'ready' });
    assert.deepEqual(parseMapBridgeMessage('{"type":"pick","lat":51.5,"lon":-0.12}'), {
      type: 'pick',
      lat: 51.5,
      lon: -0.12,
    });
  });

  it('rejects malformed or unsafe payloads', () => {
    assert.equal(parseMapBridgeMessage('not-json'), null);
    assert.equal(parseMapBridgeMessage('{"type":"pick","lat":"x","lon":1}'), null);
    assert.equal(parseMapBridgeMessage('{"type":"dragend","lat":1,"lon":2}'), null);
  });
});

describe('isAllowedMapUrl', () => {
  it('allows tile and Leaflet CDN hosts over https', () => {
    assert.equal(isAllowedMapUrl('https://basemaps.cartocdn.com/rastertiles/voyager/1/2/3.png'), true);
    assert.equal(isAllowedMapUrl('https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js'), true);
    assert.equal(isAllowedMapUrl('about:blank'), true);
  });

  it('blocks unexpected hosts and schemes', () => {
    assert.equal(isAllowedMapUrl('https://evil.example/phish'), false);
    assert.equal(isAllowedMapUrl('http://basemaps.cartocdn.com/x.png'), false);
  });
});

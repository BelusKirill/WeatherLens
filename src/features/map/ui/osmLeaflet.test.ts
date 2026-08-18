import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isSameMapPoint } from '../model/camera';
import { parseMapBridgeMessage } from '../ui/osmLeaflet';

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

describe('isSameMapPoint', () => {
  it('treats nearby coordinates as the same place', () => {
    assert.equal(isSameMapPoint({ lat: 51.5, lon: -0.12 }, { lat: 51.5001, lon: -0.1201 }), true);
    assert.equal(isSameMapPoint({ lat: 51.5, lon: -0.12 }, { lat: 48.85, lon: 2.35 }), false);
  });
});

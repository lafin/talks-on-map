'use strict';
/* globals describe, it */

let utils = require('../lib/utils');
let api = require('../controller/api');
let assert = require('assert');

describe('Api', () => {
  it('request messages', (done) => {
    api.getMessages('Санкт-Петербург', (error, response) => {
      assert.ifError(error);
      assert.ok(response);
      assert.strictEqual(response.city.name, 'Санкт-Петербург');
      assert.ok(response.city.center.lat > 0);
      assert.ok(response.city.center.lon > 0);
      assert.ok(response.city.coords.tl_lat > 0);
      assert.ok(response.city.coords.tl_lon > 0);
      assert.ok(response.city.coords.br_lat > 0);
      assert.ok(response.city.coords.br_lon > 0);
      done();
    });
  });

  it('request info', (done) => {
    api.getInfo('Санкт-Петербург', (error, response) => {
      assert.ifError(error);
      assert.ok(response);
      assert.ok(typeof response.level === 'number');
      assert.ok(typeof response.time === 'string');
      assert.ok(typeof response.weather === 'object');
      assert.ok(typeof response.weather.code === 'string');
      assert.ok(typeof response.weather.wind === 'number');
      assert.ok(typeof response.weather.temperature === 'string');
      assert.ok(typeof response.weather.dampness === 'number');
      done();
    });
  });

  it('time decode', () => {
    let rawTimeData;
    let rawTime;
    let i;
    rawTimeData = ['больше дня', 'день', 'полдня', 'час', 'минуту', '10 минут', '1 час'];
    for (i = 0; i < rawTimeData.length; i++) {
      rawTime = rawTimeData[i];
      assert.notStrictEqual(utils.timeDecode(rawTime), null);
    }

    rawTimeData = ['лол', '1 лол'];
    for (i = 0; i < rawTimeData.length; i++) {
      rawTime = rawTimeData[i];
      assert.strictEqual(utils.timeDecode(rawTime), null);
    }
  });
});

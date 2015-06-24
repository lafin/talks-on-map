/* globals describe, it */

var util = require('../lib/util');
var api = require('../controller/api');
var assert = require('assert');

describe('Api', function () {
    it('request messages', function (done) {
        api.getMessages('Санкт-Петербург', function (error, response) {
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
    it('request info', function (done) {
        api.getInfo('Санкт-Петербург', function (error, response) {
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
    it('time decode', function () {
        var rawTimeData, rawTime, i;
        rawTimeData = ['больше дня', 'день', 'полдня', 'час', 'минуту', '10 минут', '1 час'];
        for (i = 0; i < rawTimeData.length; i++) {
            rawTime = rawTimeData[i];
            assert.notStrictEqual(util.timeDecode(rawTime), null);
        }
        rawTimeData = ['лол', '1 лол'];
        for (i = 0; i < rawTimeData.length; i++) {
            rawTime = rawTimeData[i];
            assert.strictEqual(util.timeDecode(rawTime), null);
        }
    });

});
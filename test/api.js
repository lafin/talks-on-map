'use strict';
/* globals describe, it */

const utils = require('../lib/utils');
const api = require('../controller/api');
const config = require('../config');
const assert = require('assert');
const nock = require('nock');
const url = require('url');

describe('Api', () => {
  let href;
  it('request messages', (done) => {
    const geocodeReply = new Buffer('eyJyZXNwb25zZSI6eyJHZW9PYmplY3RDb2xsZWN0aW9uIjp7Im1ldGFEYXRhUHJvcGVydHkiOnsiR2VvY29kZXJSZXNwb25zZU1ldGFEYXRhIjp7InJlcXVlc3QiOiLQodCw0L3QutGCLdCf0LXRgtC10YDQsdGD0YDQsyIsImZvdW5kIjoiNiIsInJlc3VsdHMiOiIxIn19LCJmZWF0dXJlTWVtYmVyIjpbeyJHZW9PYmplY3QiOnsibWV0YURhdGFQcm9wZXJ0eSI6eyJHZW9jb2Rlck1ldGFEYXRhIjp7ImtpbmQiOiJsb2NhbGl0eSIsInRleHQiOiLQoNC+0YHRgdC40Y8sINCh0LDQvdC60YIt0J/QtdGC0LXRgNCx0YPRgNCzIiwicHJlY2lzaW9uIjoib3RoZXIiLCJBZGRyZXNzRGV0YWlscyI6eyJDb3VudHJ5Ijp7IkFkZHJlc3NMaW5lIjoi0KHQsNC90LrRgi3Qn9C10YLQtdGA0LHRg9GA0LMiLCJDb3VudHJ5TmFtZUNvZGUiOiJSVSIsIkNvdW50cnlOYW1lIjoi0KDQvtGB0YHQuNGPIiwiQWRtaW5pc3RyYXRpdmVBcmVhIjp7IkFkbWluaXN0cmF0aXZlQXJlYU5hbWUiOiLQodC10LLQtdGA0L4t0JfQsNC/0LDQtNC90YvQuSDRhNC10LTQtdGA0LDQu9GM0L3Ri9C5INC+0LrRgNGD0LMiLCJTdWJBZG1pbmlzdHJhdGl2ZUFyZWEiOnsiU3ViQWRtaW5pc3RyYXRpdmVBcmVhTmFtZSI6ItCh0LDQvdC60YIt0J/QtdGC0LXRgNCx0YPRgNCzIiwiTG9jYWxpdHkiOnsiTG9jYWxpdHlOYW1lIjoi0KHQsNC90LrRgi3Qn9C10YLQtdGA0LHRg9GA0LMifX19fX19fSwiZGVzY3JpcHRpb24iOiLQoNC+0YHRgdC40Y8iLCJuYW1lIjoi0KHQsNC90LrRgi3Qn9C10YLQtdGA0LHRg9GA0LMiLCJib3VuZGVkQnkiOnsiRW52ZWxvcGUiOnsibG93ZXJDb3JuZXIiOiIzMC4wNDI4MzQgNTkuNzQ0NDY1IiwidXBwZXJDb3JuZXIiOiIzMC41NjgzMjIgNjAuMDkwOTM1In19LCJQb2ludCI6eyJwb3MiOiIzMC4zMTU4NjggNTkuOTM5MDk1In19fV19fX0=', 'base64').toString('utf8');
    href = url.parse(config.geocode);
    nock(href.protocol + '//' + href.host)
      .get(href.path)
      .query({
        geocode: 'Санкт-Петербург',
        format: 'json',
        rspn: 0,
        results: 1,
        lang: 'ru_RU'
      })
      .reply(200, geocodeReply);

    const coordsReply = new Buffer('PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjxncHggdmVyc2lvbj0iMS4xIiBjb3VudD0iNjY5Ij4NCiAgPGV4dGVuc2lvbnM+DQogICAgPHVzZXJwb2k+DQogICAgICA8bmV4dF91cGRhdGU+MTIwPC9uZXh0X3VwZGF0ZT4NCiAgICAgIDxleHBpcmVfdGltZW91dD42MDA8L2V4cGlyZV90aW1lb3V0Pg0KICAgICAgPHJldHJ5X3RpbWVvdXQ+NTwvcmV0cnlfdGltZW91dD4NCiAgICAgIDxub192b3RpbmdfdGV4dCAvPg0KICAgIDwvdXNlcnBvaT4NCiAgPC9leHRlbnNpb25zPg0KICA8d3B0IGxhdD0iNTUuNjIxNzYzOSIgbG9uPSIzNy42MTQ4MjEwIiBjYXRpZHg9IjIiIHBvaW50X2lkPSJ1YWU5MGZjZjktN2M5OS01NjgxLWEyMTUtMGJkNjc0YjBjYTEzIj4NCiAgICA8bmFtZT4xNy/QmNGO0L0gMjM6MDEg0JrQvtC90YLRgNC+0LvRjCDRgdC60L7RgNC+0YHRgtC4INCyINGG0LXQvdGC0YAuPC9uYW1lPg0KICAgIDxjb21tZW50PtCa0L7QvdGC0YDQvtC70Ywg0YHQutC+0YDQvtGB0YLQuCDQsiDRhtC10L3RgtGALjwvY29tbWVudD4NCiAgICA8dGltZT7QsdC+0LvRjNGI0LUg0LTQvdGPINC90LDQt9Cw0LQ8L3RpbWU+DQogIDwvd3B0Pg0KICA8d3B0IGxhdD0iNTUuNjIyNDUyNCIgbG9uPSIzNy40OTczMDMwIiBjYXRpZHg9IjIiIHBvaW50X2lkPSJ1YWUyNjljYzAtYjRjMC01YmU1LThlZDYtNjkxNzI0MWQxNjRkIj4NCiAgICA8bmFtZT4yNS/QlNC10LogMTM6MjUg0JrQvtC90YLRgNC+0LvRjCDRgdC60L7RgNC+0YHRgtC4INC6INCb0LXQvdC40L3RgdC60L7QvNGDINC/0YDQvtGB0L/QtdC60YLRgzwvbmFtZT4NCiAgICA8Y29tbWVudD7QmtC+0L3RgtGA0L7Qu9GMINGB0LrQvtGA0L7RgdGC0Lgg0Log0JvQtdC90LjQvdGB0LrQvtC80YMg0L/RgNC+0YHQv9C10LrRgtGDPC9jb21tZW50Pg0KICAgIDx0aW1lPtCx0L7Qu9GM0YjQtSDQtNC90Y8g0L3QsNC30LDQtDwvdGltZT4NCiAgPC93cHQ+DQo8L2dweD4=', 'base64').toString('utf8');
    href = url.parse(config.geopoints);
    nock(href.protocol + '//' + href.host)
      .get(href.path)
      .query(true)
      .reply(200, coordsReply);
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
    const infoReply = new Buffer('PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjxpbmZvIGxhbmc9InJ1Ij4NCiAgPHJlZ2lvbiBpZD0iMjEzIiB6b29tPSIxMCIgbGF0PSI1NS43NTU3NjgiIGxvbj0iMzcuNjE3NjcxIj4NCiAgICA8dGl0bGU+0JzQvtGB0LrQstCwPC90aXRsZT4NCiAgPC9yZWdpb24+DQogIDx0cmFmZmljIHJlZ2lvbj0iMjEzIiB6b29tPSIxMCIgbGF0PSI1NS43NTU3NjgiIGxvbj0iMzcuNjE3NjcxIj4NCiAgICA8bGVuZ3RoPjE0MTA1NC45NDM1MzU8L2xlbmd0aD4NCiAgICA8bGV2ZWw+MDwvbGV2ZWw+DQogICAgPGljb24+Z3JlZW48L2ljb24+DQogICAgPHRpbWVzdGFtcD4xNDQ0MDc4ODE4PC90aW1lc3RhbXA+DQogICAgPHRpbWU+MDA6MDA8L3RpbWU+DQogICAgPGhpbnQgbGFuZz0icnUiPtCd0LAg0LTQvtGA0L7Qs9Cw0YUg0YHQstC+0LHQvtC00L3QvjwvaGludD4NCiAgICA8aGludCBsYW5nPSJlbiI+Q2xlYXIgcm9hZHM8L2hpbnQ+DQogICAgPGhpbnQgbGFuZz0iYmUiPtCd0LAg0LTQsNGA0L7Qs9Cw0YUg0YHQstCw0LHQvtC00L3QsDwvaGludD4NCiAgICA8aGludCBsYW5nPSJrayI+0JbQvtC70LTQsNGAINCx0L7RgTwvaGludD4NCiAgICA8aGludCBsYW5nPSJ0ciI+VHJhZmlrIGHDp8SxazwvaGludD4NCiAgICA8aGludCBsYW5nPSJ1ayI+0J3QsCDQtNC+0YDQvtCz0LDRhSDQstGW0LvRjNC90L48L2hpbnQ+DQogICAgPHRlbmQ+MDwvdGVuZD4NCiAgICA8dXJsPmh0dHA6Ly9tYXBzLnlhbmRleC5ydS9tb3Njb3dfdHJhZmZpYzwvdXJsPg0KICAgIDx0aXRsZT7QnNC+0YHQutCy0LA8L3RpdGxlPg0KICA8L3RyYWZmaWM+DQogIDx3ZWF0aGVyIHJlZ2lvbj0iMjEzIj4NCiAgICA8c291cmNlPm1iM2Q8L3NvdXJjZT4NCiAgICA8ZGF5Pg0KICAgICAgPHRpdGxlPtCc0L7RgdC60LLQsDwvdGl0bGU+DQogICAgICA8Y291bnRyeT7QoNC+0YHRgdC40Y88L2NvdW50cnk+DQogICAgICA8dGltZV96b25lPkV1cm9wZS9Nb3Njb3c8L3RpbWVfem9uZT4NCiAgICAgIDxzdW1tZXItdGltZT4wPC9zdW1tZXItdGltZT4NCiAgICAgIDxzdW5fcmlzZT4wNjozOTwvc3VuX3Jpc2U+DQogICAgICA8c3Vuc2V0PjE3OjU1PC9zdW5zZXQ+DQogICAgICA8ZGF5dGltZT5uPC9kYXl0aW1lPg0KICAgICAgPGRhdGUgZGF0ZT0iMjAxNS0xMC0wNVQwMDowMDowMFoiPg0KICAgICAgICA8ZGF5IHdlZWtkYXk9ItC/0L0iPjU8L2RheT4NCiAgICAgICAgPG1vbnRoIG5hbWU9ItC+0LrRgtGP0LHRgNGPIj4xMDwvbW9udGg+DQogICAgICAgIDx5ZWFyPjIwMTU8L3llYXI+DQogICAgICAgIDxkYXl0aW1lPm48L2RheXRpbWU+DQogICAgICA8L2RhdGU+DQogICAgICA8ZGF5X3BhcnQgdHlwZWlkPSI0IiB0eXBlPSLQvdC+0YfRjCI+DQogICAgICAgIDx3ZWF0aGVyX3R5cGU+0L7QsdC70LDRh9C90L4g0YEg0L/RgNC+0Y/RgdC90LXQvdC40Y/QvNC4PC93ZWF0aGVyX3R5cGU+DQogICAgICAgIDx3ZWF0aGVyX2NvZGU+Y2xvdWR5PC93ZWF0aGVyX2NvZGU+DQogICAgICAgIDxpbWFnZT5odHRwOi8veWFuZGV4LnN0L3dlYXRoZXIvdi0xL2kvaWNvbnMvbjYucG5nPC9pbWFnZT4NCiAgICAgICAgPGltYWdlLXYyIHNpemU9IjIyeDIyIj5odHRwOi8veWFuZGV4LnN0L3dlYXRoZXIvdi0xL2kvaWNvbnMvMjJ4MjIvYmtuX25fKzEwLnBuZzwvaW1hZ2UtdjI+DQogICAgICAgIDxpbWFnZS12MyBzaXplPSI0OHg0OCI+aHR0cDovL3lhbmRleC5zdC93ZWF0aGVyL3YtMS9pL2ljb25zLzQ4eDQ4L2Jrbl9uLnBuZzwvaW1hZ2UtdjM+DQogICAgICAgIDxpbWFnZV9udW1iZXI+bjY8L2ltYWdlX251bWJlcj4NCiAgICAgICAgPHdpbmRfc3BlZWQ+NDwvd2luZF9zcGVlZD4NCiAgICAgICAgPHdpbmRfZGlyZWN0aW9uIGlkPSJuIj7RgdC10LLQtdGAPC93aW5kX2RpcmVjdGlvbj4NCiAgICAgICAgPGRhbXBuZXNzPjc5PC9kYW1wbmVzcz4NCiAgICAgICAgPGhlY3RvcGFzY2FsPjk5MzwvaGVjdG9wYXNjYWw+DQogICAgICAgIDx0b3JyPjc0NTwvdG9ycj4NCiAgICAgICAgPHByZXNzdXJlPjc0NTwvcHJlc3N1cmU+DQogICAgICAgIDx0ZW1wZXJhdHVyZSBjbGFzc19uYW1lPSJ0MTAiIGNvbG9yPSJGNEYxRTAiPis5PC90ZW1wZXJhdHVyZT4NCiAgICAgICAgPHRpbWVfem9uZT5FdXJvcGUvTW9zY293PC90aW1lX3pvbmU+DQogICAgICAgIDxvYnNlcnZhdGlvbl90aW1lPjIzOjEwPC9vYnNlcnZhdGlvbl90aW1lPg0KICAgICAgICA8b2JzZXJ2YXRpb24+MjAxNS0xMC0wNVQyMzozMDowMDwvb2JzZXJ2YXRpb24+DQogICAgICA8L2RheV9wYXJ0Pg0KICAgICAgPGRheV9wYXJ0IHR5cGVpZD0iMSIgdHlwZT0i0YPRgtGA0L4iPg0KICAgICAgICA8aW1hZ2UtdjIgc2l6ZT0iMjJ4MjIiPmh0dHA6Ly95YW5kZXguc3Qvd2VhdGhlci92LTEvaS9pY29ucy8yMngyMi9ia25fZF8rNi5wbmc8L2ltYWdlLXYyPg0KICAgICAgICA8aW1hZ2UtdjMgc2l6ZT0iMzB4MzAiPmh0dHA6Ly95YW5kZXguc3Qvd2VhdGhlci92LTEvaS9pY29ucy8zMHgzMC9ia25fZC5wbmc8L2ltYWdlLXYzPg0KICAgICAgICA8dGVtcGVyYXR1cmVfZnJvbSBjbGFzc19uYW1lPSJ0NiIgY29sb3I9IkYyRjBFNiI+KzY8L3RlbXBlcmF0dXJlX2Zyb20+DQogICAgICAgIDx0ZW1wZXJhdHVyZV90byBjbGFzc19uYW1lPSJ0OCIgY29sb3I9IkYzRjFFMyI+Kzc8L3RlbXBlcmF0dXJlX3RvPg0KICAgICAgPC9kYXlfcGFydD4NCiAgICAgIDxkYXlfcGFydCB0eXBlaWQ9IjIiIHR5cGU9ItC00LXQvdGMIj4NCiAgICAgICAgPGltYWdlLXYyIHNpemU9IjIyeDIyIj5odHRwOi8veWFuZGV4LnN0L3dlYXRoZXIvdi0xL2kvaWNvbnMvMjJ4MjIvYmtuX2RfKzgucG5nPC9pbWFnZS12Mj4NCiAgICAgICAgPGltYWdlLXYzIHNpemU9IjMweDMwIj5odHRwOi8veWFuZGV4LnN0L3dlYXRoZXIvdi0xL2kvaWNvbnMvMzB4MzAvYmtuX2QucG5nPC9pbWFnZS12Mz4NCiAgICAgICAgPHRlbXBlcmF0dXJlX2Zyb20gY2xhc3NfbmFtZT0idDgiIGNvbG9yPSJGM0YxRTMiPis3PC90ZW1wZXJhdHVyZV9mcm9tPg0KICAgICAgICA8dGVtcGVyYXR1cmVfdG8gY2xhc3NfbmFtZT0idDEwIiBjb2xvcj0iRjRGMUUwIj4rOTwvdGVtcGVyYXR1cmVfdG8+DQogICAgICA8L2RheV9wYXJ0Pg0KICAgICAgPGRheV9wYXJ0IHR5cGVpZD0iMyIgdHlwZT0i0LLQtdGH0LXRgCI+DQogICAgICAgIDxpbWFnZS12MiBzaXplPSIyMngyMiI+aHR0cDovL3lhbmRleC5zdC93ZWF0aGVyL3YtMS9pL2ljb25zLzIyeDIyL2Jrbl9uXys2LnBuZzwvaW1hZ2UtdjI+DQogICAgICAgIDxpbWFnZS12MyBzaXplPSIzMHgzMCI+aHR0cDovL3lhbmRleC5zdC93ZWF0aGVyL3YtMS9pL2ljb25zLzMweDMwL2Jrbl9uLnBuZzwvaW1hZ2UtdjM+DQogICAgICAgIDx0ZW1wZXJhdHVyZV9mcm9tIGNsYXNzX25hbWU9InQ0IiBjb2xvcj0iRjFGMEU5Ij4rNDwvdGVtcGVyYXR1cmVfZnJvbT4NCiAgICAgICAgPHRlbXBlcmF0dXJlX3RvIGNsYXNzX25hbWU9InQ4IiBjb2xvcj0iRjNGMUUzIj4rNzwvdGVtcGVyYXR1cmVfdG8+DQogICAgICA8L2RheV9wYXJ0Pg0KICAgICAgPGRheV9wYXJ0IHR5cGVpZD0iNCIgdHlwZT0i0L3QvtGH0YwiPg0KICAgICAgICA8aW1hZ2UtdjIgc2l6ZT0iMjJ4MjIiPmh0dHA6Ly95YW5kZXguc3Qvd2VhdGhlci92LTEvaS9pY29ucy8yMngyMi9ia25fbl8rMi5wbmc8L2ltYWdlLXYyPg0KICAgICAgICA8aW1hZ2UtdjMgc2l6ZT0iMzB4MzAiPmh0dHA6Ly95YW5kZXguc3Qvd2VhdGhlci92LTEvaS9pY29ucy8zMHgzMC9ia25fbi5wbmc8L2ltYWdlLXYzPg0KICAgICAgICA8dGVtcGVyYXR1cmVfZnJvbSBjbGFzc19uYW1lPSJ0MCIgY29sb3I9IkYwRUZGMCI+MDwvdGVtcGVyYXR1cmVfZnJvbT4NCiAgICAgICAgPHRlbXBlcmF0dXJlX3RvIGNsYXNzX25hbWU9InQ0IiBjb2xvcj0iRjFGMEU5Ij4rNDwvdGVtcGVyYXR1cmVfdG8+DQogICAgICA8L2RheV9wYXJ0Pg0KICAgICAgPHRvZGF5Pg0KICAgICAgICA8dGVtcGVyYXR1cmUgY2xhc3NfbmFtZT0idDE4IiBjb2xvcj0iRjdGM0QzIj4rMTg8L3RlbXBlcmF0dXJlPg0KICAgICAgPC90b2RheT4NCiAgICA8L2RheT4NCiAgICA8dXJsIHNsdWc9Im1vc2NvdyI+aHR0cDovL3BvZ29kYS55YW5kZXgucnUvbW9zY293LzwvdXJsPg0KICA8L3dlYXRoZXI+DQo8L2luZm8+', 'base64').toString('utf8');
    href = url.parse(config.cityinfo);
    nock(href.protocol + '//' + href.host)
      .get(href.path)
      .query({
        region: 2,
        format: 'json'
      })
      .reply(200, infoReply);

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

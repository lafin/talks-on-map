const request = require('request');
const xmlParse = require('xml2js').parseString;
const uuid = require('node-uuid');
const cache = require('memory-cache');

const config = require('./config');
const hub = require('./lib/hub');
const utils = require('./lib/utils');

const getCityInfoByName = (name) => {
  if (!name) {
    throw new Error('Not set city');
  }

  const cities = config.cities;
  for (let i = 0; i < cities.length; i += 1) {
    if (cities[i].name === name) {
      return cities[i];
    }
  }

  return null;
};

const getTrafficCongestion = (city, callback) => {
  if (!city) {
    return callback(new Error('Not set city'));
  }

  return request.get({
    url: config.cityinfo,
    qs: {
      region: getCityInfoByName(city).regionId,
      format: 'json'
    },
    json: true
  }, (error, response) => {
    if (error || !response.body) {
      return callback(error || new Error('Empty response'));
    }

    return xmlParse(response.body, (error, response) => {
      if (error) {
        return callback(error);
      }

      if (response &&
          response.info &&
          response.info.traffic &&
          response.info.traffic.length &&
          response.info.weather &&
          response.info.weather.length &&
          response.info.weather[0].day &&
          response.info.weather[0].day.length &&
          response.info.weather[0].day[0].day_part &&
          response.info.weather[0].day[0].day_part.length) {
        const traffic = response.info.traffic[0];
        const weather = response.info.weather[0].day[0].day_part[0];

        return callback(null, {
          level: traffic.level && traffic.level.length && +traffic.level[0],
          time: traffic.time && traffic.time.length && traffic.time[0],
          online: +hub.connectCounter,
          weather: {
            code: weather.weather_code[0],
            wind: +weather.wind_speed[0],
            temperature: weather.temperature[0]._,
            dampness: +weather.dampness[0]
          }
        });
      }
      return callback(new Error('Empty response'));
    });
  });
};

const getMessages = (city, callback) => {
  if (!city) {
    return callback(new Error('Not set city'));
  }

  return request.get({
    url: config.geocode,
    qs: {
      geocode: city,
      format: 'json',
      rspn: 0,
      results: 1,
      lang: 'ru_RU'
    },
    json: true
  }, (error, response) => {
    if (error || !response.body) {
      return callback(error || new Error('Empty response'));
    }

    let coords = null;
    let cityObj = null;
    const messages = [];
    if (response.body.response &&
        response.body.response.GeoObjectCollection &&
        response.body.response.GeoObjectCollection.featureMember &&
        response.body.response.GeoObjectCollection.featureMember.length &&
        response.body.response.GeoObjectCollection.featureMember[0].GeoObject &&
        response.body.response.GeoObjectCollection.featureMember[0].GeoObject.boundedBy &&
        response.body.response.GeoObjectCollection.featureMember[0].GeoObject.boundedBy.Envelope) {
      cityObj = response.body.response.GeoObjectCollection.featureMember[0].GeoObject;
      const rawCoords = cityObj.boundedBy.Envelope;
      const lowerCorner = rawCoords.lowerCorner.split(' ');
      const upperCorner = rawCoords.upperCorner.split(' ');
      coords = {
        tl_lat: +lowerCorner[1],
        tl_lon: +lowerCorner[0],
        br_lat: +upperCorner[1],
        br_lon: +upperCorner[0]
      };
    }

    if (coords) {
      return request.get({
        url: config.geopoints,
        qs: {
          uuid: uuid.v4(),
          zoom: 6,
          tl_lat: coords.tl_lat,
          tl_lon: coords.tl_lon,
          br_lat: coords.br_lat,
          br_lon: coords.br_lon,

          // 0 - "Accident"
          // 1 - "Road works"
          // 2 - "Speed camera"
          // 3 - "Other"
          // 4 - "Closure"
          // 5 - "Raised bridge"
          // 6 - "Speech bubble"
          catlist: [0, 3, 6].join(),
          utf: 1,

          // gzip: 1,
          ver: 2,
          lang: 'ru_RU'
        },
        gzip: true
      }, (error, response) => {
        if (error || !response.body) {
          return callback(error || new Error('Empty response'));
        }

        return xmlParse(response.body, (error, response) => {
          if (error || !response) {
            return callback(error || new Error('Empty response'));
          }

          if (response.gpx && response.gpx.wpt) {
            for (let i = 0; i < response.gpx.wpt.length; i += 1) {
              const point = response.gpx.wpt[i];
              messages.push({
                type: +point.$.catidx,
                longitude: +point.$.lon,
                latitude: +point.$.lat,
                text: point.comment[0],
                time: utils.timeDecode(point.time[0])
              });
            }
          }

          const coordObj = cityObj.Point.pos.split(' ');
          return callback(null, {
            city: {
              name: cityObj.name,
              center: {
                longitude: +coordObj[0],
                latitude: +coordObj[1]
              },
              bounds: [
                [coords.tl_lat, coords.tl_lon],
                [coords.br_lat, coords.br_lon],
              ]
            },
            points: messages
          });
        });
      });
    }
    return callback(new Error('Can\'t get coords'));
  });
};

const cachedMessages = {};
const mergeMessagesBeforeSave = (city, messages) => {
  if (!Object.prototype.hasOwnProperty.call(cachedMessages, 'city')) {
    cachedMessages[city] = [];
  }
  for (let i = 0; i < messages.length; i += 1) {
    const message = messages[i];
    let found = false;
    for (let j = 0; j < cachedMessages[city].length; j += 1) {
      const cachedMessage = cachedMessages[city][j];
      if (message.text === cachedMessage.text &&
        message.type === cachedMessage.type &&
        (message.longitude).toFixed(4) === (message.longitude).toFixed(4) &&
        (message.latitude).toFixed(4) === (message.latitude).toFixed(4)) {
        cachedMessage.ttl = Date.now() + 30e3;
        found = true;
      }
    }
    if (!found) {
      message.ttl = Date.now() + 30e3;
      cachedMessages[city].push(message);
    }
  }
  cachedMessages[city] = cachedMessages[city].filter(message => message.ttl > Date.now());
  return cachedMessages[city];
};

module.exports = {
  getMessages: (city, callback) => {
    const messages = cache.get(`messages:${city}`);
    if (messages) {
      return callback(null, messages);
    }

    return getMessages(city, (error, response) => {
      if (error || !response) {
        return callback(error || new Error('Empty response'));
      }
      response.points = mergeMessagesBeforeSave(city, response.points);
      cache.put(`messages:${city}`, response, 5e3);
      return callback(null, response);
    });
  },

  getInfo: (city, callback) => {
    const info = cache.get(`info:${city}`);
    if (info) {
      return callback(null, info);
    }

    return getTrafficCongestion(city, (error, response) => {
      if (error || !response) {
        return callback(error || new Error('Empty response'));
      }

      cache.put(`info:${city}`, response, 15e3);
      return callback(null, response);
    });
  }
};

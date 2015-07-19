'use strict';

let request = require('request');
let xmlParse = require('xml2js').parseString;
let uuid = require('node-uuid');
let cache = require('memory-cache');

let config = require('../config');
let hub = require('../lib/hub');
let Info = require('../model/Info');
let utils = require('../lib/utils');

let getCityInfoByName = (name) => {
  if (!name) {
    throw new Error('Not set city');
  }

  let cities = config.cities;
  for (let i = 0; i < cities.length; i++) {
    if (cities[i].name === name) {
      return cities[i];
    }
  }

  return null;
};

let getTrafficCongestion = (city, callback) => {
  if (!city) {
    return callback(new Error('Not set city'));
  }

  request.get({
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

    xmlParse(response.body, (error, response) => {
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

        let traffic = response.info.traffic[0];
        let weather = response.info.weather[0].day[0].day_part[0];

        callback(null, {
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
      } else {
        return callback(new Error('Empty response'));
      }
    });
  });
};

let getMessages = (city, callback) => {
  if (!city) {
    return callback(new Error('Not set city'));
  }

  request.get({
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
    let messages = [];
    if (response.body.response &&
        response.body.response.GeoObjectCollection &&
        response.body.response.GeoObjectCollection.featureMember &&
        response.body.response.GeoObjectCollection.featureMember.length &&
        response.body.response.GeoObjectCollection.featureMember[0].GeoObject &&
        response.body.response.GeoObjectCollection.featureMember[0].GeoObject.boundedBy &&
        response.body.response.GeoObjectCollection.featureMember[0].GeoObject.boundedBy.Envelope) {
      cityObj = response.body.response.GeoObjectCollection.featureMember[0].GeoObject;
      let rawCoords = cityObj.boundedBy.Envelope;
      let lowerCorner = rawCoords.lowerCorner.split(' ');
      let upperCorner = rawCoords.upperCorner.split(' ');
      coords = {
        tl_lat: +lowerCorner[1],
        tl_lon: +lowerCorner[0],
        br_lat: +upperCorner[1],
        br_lon: +upperCorner[0]
      };
    }

    if (coords) {
      request.get({
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

        xmlParse(response.body, (error, response) => {
          if (error || !response) {
            return callback(error || new Error('Empty response'));
          }

          if (response.gpx && response.gpx.wpt) {
            for (let i = 0; i < response.gpx.wpt.length; i++) {
              let point = response.gpx.wpt[i];
              messages.push({
                type: +point.$.catidx,
                coords: {
                  lat: +point.$.lat,
                  lon: +point.$.lon
                },
                text: point.comment[0],
                time: utils.timeDecode(point.time[0])
              });
            }
          }

          let coordObj = cityObj.Point.pos.split(' ');
          return callback(null, {
            city: {
              name: cityObj.name,
              center: {
                lat: +coordObj[0],
                lon: +coordObj[1]
              },
              coords: coords
            },
            messages: messages
          });
        });
      });
    } else {
      return callback(new Error('Can\'t get coords'));
    }
  });
};

let getStatsInfo = (city, callback) => {
  if (!city) {
    return callback(new Error('Not set city'));
  }

  let now = Date.now();
  let cityInfo = getCityInfoByName(city);
  Info.find({
    city: cityInfo.regionId,
    date: {
      $lt: now,
      $gt: now - 604800000 // last week
    }
  }, (error, data) => {
    if (error) {
      return callback(error);
    }

    data = data.map((d) => {
      return {
        date: d.date,
        accident: d.accident,
        population: cityInfo.population,
        level: d.level,
        weather: d.weather
      };
    });
    return callback(null, data);
  });
};

module.exports = {
  getMessages: (city, callback) => {
    let messages = cache.get('messages:' + city);
    if (messages) {
      return callback(null, messages);
    }

    return getMessages(city, (error, response) => {
      if (error || !response) {
        return callback(error || new Error('Empty response'));
      }

      cache.put('messages:' + city, response, 5000);
      return callback(null, response);
    });
  },

  getInfo: (city, callback) => {
    let info = cache.get('info:' + city);
    if (info) {
      return callback(null, info);
    }

    return getTrafficCongestion(city, (error, response) => {
      if (error || !response) {
        return callback(error || new Error('Empty response'));
      }

      cache.put('info:' + city, response, 15000);
      return callback(null, response);
    });
  },

  getStats: (city, callback) => {
    let stats = cache.get('stats:' + city);
    if (stats) {
      return callback(null, stats);
    }

    return getStatsInfo(city, (error, response) => {
      if (error || !response) {
        return callback(error || new Error('Empty response'));
      }

      cache.put('stats:' + city, response, 15000);
      return callback(null, response);
    });
  }
};

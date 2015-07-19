'use strict';

let async = require('async');
let Info = require('../model/Info');
let api = require('./api');

let calculateAccident = (response) => {
  let countAccident = 0;
  for (let i = 0; i < response.messages.length; i++) {
    let message = response.messages[i];
    if (message.type === 0) {
      countAccident += 1;
    }
  }

  return countAccident;
};

let collectionInfoData = (cities, date, callback) => {
  async.mapLimit(cities, 2, (city, mapLimitCallback) => {
    async.parallel([
      (parallelCallback) => {
        api.getMessages(city.name, (error, response) => {
          if (error) {
            return parallelCallback(error);
          }

          return parallelCallback(null, {
            accident: calculateAccident(response)
          });
        });
      },

      (parallelCallback) => {
        api.getInfo(city.name, (error, info) => {
          if (error) {
            return parallelCallback(error);
          }

          return parallelCallback(null, {
            level: info.level,
            weather: info.weather
          });
        });
      }

    ],
    (error, results) => {
      if (error) {
        return mapLimitCallback(error);
      }

      return mapLimitCallback(null, {
        city: city.regionId,
        date: date,
        accident: results[0].accident,
        level: results[1].level,
        weather: results[1].weather
      });
    });
  }, callback);
};

let saveResults = (results, callback) => {
  Info.create(results, (error) => {
    return callback(error);
  });
};

let self = module.exports = {
  getInfo: (cities) => {
    let date = Date.now();
    collectionInfoData(cities, date, (error, results) => {
      if (error) {
        console.log('restart task getInfo');
        console.error(error);
        return self.getInfo(cities);
      } else {
        saveResults(results, (error) => {
          if (error) {
            console.log('restart task getInfo');
            console.error(error);
            return self.getInfo(cities);
          } else {
            return null;
          }
        });
      }
    });
  }
};

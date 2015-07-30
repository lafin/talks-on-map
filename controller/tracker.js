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
  return async.mapLimit(cities, 2, (city, mapLimitCallback) => {
    return async.parallel([
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
  return Info.create(results, (error) => {
    return callback(error);
  });
};

let timeStart;
let getInfo = (cities, noFirstStart) => {
  noFirstStart = noFirstStart || false;
  if (!noFirstStart) {
    timeStart = Date.now();
  }
  let date = Date.now();
  return collectionInfoData(cities, date, (error, results) => {
    if (error) {
      return tryRequestAgain(error, cities);
    } else {
      return saveResults(results, (error) => {
        if (error) {
          return tryRequestAgain(error, cities);
        } else {
          return null;
        }
      });
    }
  });
};

let tryRequestAgain = (error, cities) => {
  if ((Date.now() - timeStart) > 30e3) {
    console.error('abort retry');
    return null;
  }
  console.log('%s restart task getInfo', (new Date()).toString());
  console.error(error);
  return setTimeout(() => getInfo(cities, true), 5e3);
};

let gc = () => {
  try {
    global.gc();
  } catch (e) {
    console.error('need --expose-gc option for application');
  }
};

module.exports = {
  getInfo: getInfo,
  gc: gc
};

var async = require('async'),
    Info = require('../model/Info'),
    api = require('./api');

function calculateAccident(response) {
    var countAccident = 0;
    for (var i = 0; i < response.messages.length; i++) {
        var message = response.messages[i];
        if (message.type === 0) {
            countAccident += 1;
        }
    }
    return countAccident;
}

function collectionInfoData(cities, date, callback) {
    async.mapLimit(cities, 2, function (city, mapLimitCallback) {
        async.parallel([
                function (parallelCallback) {
                    api.getMessages(city.name, function (error, response) {
                        if (error) {
                            return parallelCallback(error);
                        }
                        return parallelCallback(null, {
                            accident: calculateAccident(response)
                        });
                    });
                },
                function (parallelCallback) {
                    api.getInfo(city.name, function (error, info) {
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
            function (error, results) {
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
}

function saveResults(results, callback) {
    Info.create(results, function (error) {
        return callback(error);
    });
}

var self = module.exports = {
    getInfo: function (cities) {
        var date = Date.now();
        collectionInfoData(cities, date, function (error, results) {
            if (error) {
                console.log('restart task getInfo');
                console.error(error);
                return self.getInfo(cities);
            } else {
                saveResults(results, function (error) {
                    if (error) {
                        console.log('restart task getInfo');
                        console.error(error);
                        return self.getInfo(cities);
                    } else {
                        console.log('done');
                        return;
                    }
                });
            }
        });
    }
};
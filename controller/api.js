var request = require('request'),
    xmlParse = require('xml2js').parseString,
    uuid = require('node-uuid'),
    cache = require('memory-cache');

var config = require('../config'),
    hub = require('../lib/hub'),
    Info = require('../model/Info'),
    util = require('../lib/util');

var getCityInfoByName = function (name) {
    if (!name) {
        throw new Error('Not set city');
    }
    var cities = config.cities;
    for (var i = 0; i < cities.length; i++) {
        if (cities[i].name === name) {
            return cities[i];
        }
    }
    return null;
};

var getTrafficCongestion = function (city, callback) {
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
    }, function (error, response) {
        if (error || !response.body) {
            return callback(error || new Error('Empty response'));
        }
        xmlParse(response.body, function (error, response) {
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

                var traffic = response.info.traffic[0];
                var weather = response.info.weather[0].day[0].day_part[0];

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

var getMessages = function (city, callback) {
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
    }, function (error, response) {
        if (error || !response.body) {
            return callback(error || new Error('Empty response'));
        }
        var coords = null,
            cityObj = null,
            messages = [];
        if (response.body.response &&
            response.body.response.GeoObjectCollection &&
            response.body.response.GeoObjectCollection.featureMember &&
            response.body.response.GeoObjectCollection.featureMember.length &&
            response.body.response.GeoObjectCollection.featureMember[0].GeoObject &&
            response.body.response.GeoObjectCollection.featureMember[0].GeoObject.boundedBy &&
            response.body.response.GeoObjectCollection.featureMember[0].GeoObject.boundedBy.Envelope) {
            cityObj = response.body.response.GeoObjectCollection.featureMember[0].GeoObject;
            var rawCoords = cityObj.boundedBy.Envelope,
                lowerCorner = rawCoords.lowerCorner.split(' '),
                upperCorner = rawCoords.upperCorner.split(' ');
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
            }, function (error, response) {
                if (error || !response.body) {
                    return callback(error || new Error('Empty response'));
                }
                xmlParse(response.body, function (error, response) {
                    if (error || !response) {
                        return callback(error || new Error('Empty response'));
                    }
                    if (response.gpx && response.gpx.wpt) {
                        for (var i = 0; i < response.gpx.wpt.length; i++) {
                            var point = response.gpx.wpt[i];
                            messages.push({
                                type: +point.$.catidx,
                                coords: {
                                    lat: +point.$.lat,
                                    lon: +point.$.lon
                                },
                                text: point.comment[0],
                                time: util.timeDecode(point.time[0])
                            });
                        }
                    }
                    var coordObj = cityObj.Point.pos.split(' ');
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

var getStatsInfo = function (city, callback) {
    if (!city) {
        return callback(new Error('Not set city'));
    }
    var now = Date.now();
    Info.find({
        city: getCityInfoByName(city).regionId,
        date: {
            $lt: now,
            $gt: now - 604800000 // last week
        }
    }, function (error, data) {
        if (error) {
            return callback(error);
        }
        data = data.map(function (d) {
            return {
                date: d.date,
                accident: d.accident,
                level: d.level,
                weather: d.weather
            };
        });
        return callback(null, data);
    });
};

module.exports = {
    getMessages: function (city, callback) {
        var messages = cache.get('messages:' + city);
        if (messages) {
            return callback(null, messages);
        }
        return getMessages(city, function (error, response) {
            if (error || !response) {
                return callback(error || new Error('Empty response'));
            }
            cache.put('messages:' + city, response, 5000);
            return callback(null, response);
        });
    },

    getInfo: function (city, callback) {
        var info = cache.get('info:' + city);
        if (info) {
            return callback(null, info);
        }
        return getTrafficCongestion(city, function (error, response) {
            if (error || !response) {
                return callback(error || new Error('Empty response'));
            }
            cache.put('info:' + city, response, 15000);
            return callback(null, response);
        });
    },

    getStats: function (city, callback) {
        var stats = cache.get('stats:' + city);
        if (stats) {
            return callback(null, stats);
        }
        return getStatsInfo(city, function (error, response) {
            if (error || !response) {
                return callback(error || new Error('Empty response'));
            }
            cache.put('stats:' + city, response, 15000);
            return callback(null, response);
        });
    }
};
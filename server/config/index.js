'use strict';

let secret;
try {
  secret = require('./secret');
} catch (e) {
  secret = {};
  console.log('File with secret not found');
}

module.exports = {
  geocode: secret.geocode || process.env.GEOCODE,
  geopoints: secret.geopoints || process.env.GEOPOINTS,
  cityinfo: secret.cityinfo || process.env.CITYINFO,
  cities: [{
    name: 'Москва',
    population: 12108e3,
    regionId: 213
  }, {
    name: 'Санкт-Петербург',
    population: 5132e3,
    regionId: 2
  }, {
    name: 'Ростов-на-Дону',
    population: 1110e3,
    regionId: 39
  }, {
    name: 'Новосибирск',
    population: 1548e3,
    regionId: 65
  }, {
    name: 'Екатеринбург',
    population: 1412e3,
    regionId: 54
  }, {
    name: 'Нижний Новгород',
    population: 1264e3,
    regionId: 47
  }, {
    name: 'Казань',
    population: 1191e3,
    regionId: 43
  }, {
    name: 'Самара',
    population: 1172e3,
    regionId: 51
  }, {
    name: 'Челябинск',
    population: 1169e3,
    regionId: 56
  }, {
    name: 'Омск',
    population: 1166e3,
    regionId: 66
  }, {
    name: 'Уфа',
    population: 1097e3,
    regionId: 172
  }, {
    name: 'Красноярск',
    population: 1036e3,
    regionId: 62
  }, {
    name: 'Пермь',
    population: 1026e3,
    regionId: 50
  }, {
    name: 'Волгоград',
    population: 1018e3,
    regionId: 38
  }, {
    name: 'Воронеж',
    population: 1014e3,
    regionId: 193
  }, {
    name: 'Саратов',
    population: 841e3,
    regionId: 194
  }, {
    name: 'Краснодар',
    population: 806e3,
    regionId: 35
  }]
};

var secret = require('./secret');

module.exports = {
    db: process.env.MONGODB || 'mongodb://localhost:27017/info',
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
        regionId: 10174
    }, {
        name: 'Ростов-на-Дону',
        population: 1110e3,
        regionId: 11029
    }, {
        name: 'Новосибирск',
        population: 1548e3,
        regionId: 11316
    }, {
        name: 'Екатеринбург',
        population: 1412e3,
        regionId: 11162
    }, {
        name: 'Нижний Новгород',
        population: 1264e3,
        regionId: 11079
    }, {
        name: 'Казань',
        population: 1191e3,
        regionId: 11119
    }, {
        name: 'Самара',
        population: 1172e3,
        regionId: 11131
    }, {
        name: 'Челябинск',
        population: 1169e3,
        regionId: 11225
    }, {
        name: 'Омск',
        population: 1166e3,
        regionId: 11318
    }, {
        name: 'Уфа',
        population: 1097e3,
        regionId: 11111
    }, {
        name: 'Красноярск',
        population: 1036e3,
        regionId: 11309
    }, {
        name: 'Пермь',
        population: 1026e3,
        regionId: 11108
    }, {
        name: 'Волгоград',
        population: 1018e3,
        regionId: 10950
    }, {
        name: 'Воронеж',
        population: 1014e3,
        regionId: 10672
    }, {
        name: 'Саратов',
        population: 841e3,
        regionId: 11146
    }, {
        name: 'Краснодар',
        population: 806e3,
        regionId: 10995
    }],
    tasks: [{
        cron: '0 */20 * * * *',
        name: 'getInfo'
    }]
};
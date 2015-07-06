var secret = require('./secret');

module.exports = {
    db: process.env.MONGODB || 'mongodb://localhost:27017/info',
    geocode: secret.geocode || process.env.GEOCODE,
    geopoints: secret.geopoints || process.env.GEOPOINTS,
    cityinfo: secret.cityinfo || process.env.CITYINFO,
    cities: [{
        name: 'Москва',
        regionId: 213
    }, {
        name: 'Санкт-Петербург',
        regionId: 10174
    }, {
        name: 'Ростов-на-Дону',
        regionId: 11029
    }, {
        name: 'Новосибирск',
        regionId: 11316
    }, {
        name: 'Екатеринбург',
        regionId: 11162
    }, {
        name: 'Нижний Новгород',
        regionId: 11079
    }, {
        name: 'Казань',
        regionId: 11119
    }, {
        name: 'Самара',
        regionId: 11131
    }, {
        name: 'Челябинск',
        regionId: 11225
    }, {
        name: 'Омск',
        regionId: 11318
    }, {
        name: 'Уфа',
        regionId: 11111
    }, {
        name: 'Красноярск',
        regionId: 11309
    }, {
        name: 'Пермь',
        regionId: 11108
    }, {
        name: 'Волгоград',
        regionId: 10950
    }, {
        name: 'Воронеж',
        regionId: 10672
    }, {
        name: 'Саратов',
        regionId: 11146
    }, {
        name: 'Краснодар',
        regionId: 10995
    }],
    tasks: [{
        cron: '0 */20 * * * *',
        name: 'getInfo'
    }]
};
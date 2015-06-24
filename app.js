/**
 * Module dependencies.
 */

var express = require('express'),
    methodOverride = require('method-override'),
    logger = require('morgan'),
    path = require('path'),
    fs = require('fs'),
    Logme = require('logme').Logme,
    hub = require('./lib/hub'),
    config = require('./config'),
    os = require('os'),
    mongoose = require('mongoose'),
    later = require('later');

try {
    var cpuCount = os.cpus().length,
        limit = 4 * 1024 * cpuCount;
    require('posix').setrlimit('nofile', {
        soft: limit,
        hard: limit
    });
} catch (e) {
    console.error(e.message);
}

/**
 * Global vars
 */

hub.connectCounter = 0;

/**
 * Logger
 */

var logFile = fs.createWriteStream(__dirname + '/log.txt', {
        flags: 'a'
    }),
    logme = hub.logme = new Logme({
        stream: logFile,
        theme: 'clean'
    });

/**
 * Create Express server.
 */

var app = express();

/**
 * Socket
 */

var server = require('http').Server(app),
    io = require('socket.io')(server);


/**
 * Mongoose
 */

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function (error) {
    console.error(error);
});

/**
 * Controllers
 */

var main = require('./controller/main'),
    api = require('./controller/api'),
    tracker = require('./controller/tracker');

later.date.localTime();
for (var i = 0; i < config.tasks.length; i++) {
    var task = config.tasks[i];
    var scheduler = later.parse.cron(task.cron, true);
    later.setInterval(tracker[task.name].bind(this, config.cities), scheduler);
}

/**
 * Socket
 */
var sendMessages = function (city, socket) {
    return api.getMessages(city, function (error, response) {
        if (error) {
            return;
        }
        socket = socket || io.to(city);
        socket.emit('city:messages', response);
    });
};

var sendInfo = function (city, socket) {
    return api.getInfo(city, function (error, response) {
        if (error) {
            return;
        }
        socket = socket || io.to(city);
        socket.emit('city:info', response);
    });
};

var sendStats = function (city, socket) {
    return api.getStats(city, function (error, response) {
        if (error) {
            return;
        }
        socket = socket || io.to(city);
        socket.emit('city:stats', response);
    });
};

io.on('connection', function (socket) {
    socket.on('ping', function () {
        socket.emit('pong', {
            loadavg: (os.loadavg()[0]).toFixed(2),
            responseTime: Date.now(),
            usemem: ((os.totalmem() - os.freemem()) / 1024 / 1024).toFixed(2)
        });
    });
    console.log('a user connected');
    hub.connectCounter += 1;
    socket.on('city:set', function (city) {
        socket.rooms.map(function (room) {
            socket.leave(room);
        });
        socket.join(city);
        // messages
        sendMessages(city, socket);
        // info
        sendInfo(city, socket);
    });
    socket.on('city:stats', function (city) {
        sendStats(city, socket);
    });
    socket.on('disconnect', function () {
        hub.connectCounter -= 1;
        console.log('user disconnected');
    });
});

// messages
setInterval(function () {
    for (var i = 0; i < config.cities.length; i++) {
        var city = config.cities[i].name;
        sendMessages(city);
    }
}, 5e3);

// info
setInterval(function () {
    for (var i = 0; i < config.cities.length; i++) {
        var city = config.cities[i].name;
        sendInfo(city);
    }
}, 15e3);

/**
 * Express configuration.
 */

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'jade');

app.use(logger('combined', {
    skip: function (req, res) {
        return res.statusCode < 400;
    },
    stream: logFile
}));

app.use(methodOverride());
var hour = 3600000,
    day = hour * 24,
    week = day * 7;
app.use(express['static'](path.join(__dirname, 'build'), {
    maxAge: week
}));

try {

    /**
     * Main routes.
     */

    app.get('/', main.index);

    /**
     * Error handlers
     */
    app.use(function (req, res) {
        res.status(404).render('error/404');
    });
    app.use(function (err, req, res) {
        res.status(500).render('error/50x', {
            error: err
        });
    });

} catch (error) {
    logme.error(error.message);
}

/**
 * Start Express server.
 */

server.listen(app.get('port'), function () {
    console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
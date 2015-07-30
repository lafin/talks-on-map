'use strict';

/**
 * Module dependencies.
 */

let express = require('express');
let methodOverride = require('method-override');
let logger = require('morgan');
let path = require('path');
let fs = require('fs');
let hub = require('./lib/hub');
let config = require('./config');
let os = require('os');
let mongoose = require('mongoose');
let later = require('later');
let posix = require('posix');

try {
  let cpuCount = os.cpus().length;
  let limit = 10 * 1024 * cpuCount;
  posix.setrlimit('nofile', {
    soft: limit,
    hard: limit
  });
} catch (error) {
  console.error(error.message);
}

/**
 * Global lets
 */

hub.connectCounter = 0;

/**
 * Logger
 */

let logFile = fs.createWriteStream(path.join(__dirname, '/log.txt'), {
  flags: 'a'
});

/**
 * Create Express server.
 */

let app = express();

/**
 * Socket
 */

let server = require('http').Server(app);
let io = require('socket.io')(server);

/**
 * Mongoose
 */

mongoose.connect(config.db);
let db = mongoose.connection;
db.on('error', function(error) {
  console.error(error);
});

/**
 * Controllers
 */

let main = require('./controller/main');
let api = require('./controller/api');
let tracker = require('./controller/tracker');

later.date.localTime();
for (let i = 0; i < config.tasks.length; i++) {
  let task = config.tasks[i];
  let scheduler = later.parse.cron(task.cron, true);
  later.setInterval(tracker[task.name].bind(this, config.cities), scheduler);
}

/**
 * Socket
 */
let sendMessages = function(city, socket) {
  return api.getMessages(city, function(error, response) {
    if (error) {
      return;
    }

    socket = socket || io.to(city);
    socket.emit('city:messages', response);
  });
};

let sendInfo = function(city, socket) {
  return api.getInfo(city, function(error, response) {
    if (error) {
      return;
    }

    socket = socket || io.to(city);
    socket.emit('city:info', response);
  });
};

let sendStats = function(city, socket) {
  return api.getStats(city, function(error, response) {
    if (error) {
      return;
    }

    socket = socket || io.to(city);
    socket.emit('city:stats', response);
  });
};

let getStatus = () => {
  return {
    loadavg: os.loadavg(),
    localtime: Date.now(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage()
  };
};

io.on('connection', function(socket) {
  socket.on('ping', function() {
    socket.emit('pong', getStatus());
  });
  hub.connectCounter += 1;
  socket.on('city:set', function(city) {
    socket.rooms.map(function(room) {
      socket.leave(room);
    });
    socket.join(city);

    // messages
    sendMessages(city, socket);

    // info
    sendInfo(city, socket);
  });
  socket.on('city:stats', function(city) {
    sendStats(city, socket);
  });
  socket.on('disconnect', function() {
    hub.connectCounter -= 1;
  });
});

// messages
setInterval(function() {
  for (let i = 0; i < config.cities.length; i++) {
    let city = config.cities[i].name;
    sendMessages(city);
  }
}, 5e3);

// info
setInterval(function() {
  for (let i = 0; i < config.cities.length; i++) {
    let city = config.cities[i].name;
    sendInfo(city);
  }
}, 15e3);

/**
 * Validate api keys
 */

let validateApiKey = (apiKey) => {
  return apiKey && true;
};

/**
 * Express configuration.
 */

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'jade');

app.use(logger('combined', {
  skip: function(req, res) {
    return res.statusCode < 400;
  },
  stream: logFile
}));

app.use(methodOverride());
let hour = 3600000;
let day = hour * 24;
let week = day * 7;
app.use(express.static(path.join(__dirname, 'build'), {
  maxAge: week
}));

try {

  /**
   * Main routes.
   */
  app.get('/', main.index);
  app.get('/status', (req, res) => {
    return res.json(getStatus());
  });

  app.get('/v1/:city/accidents', (req, res) => {
    let apiKey = req.query.api_key;
    if (validateApiKey(apiKey)) {
      return api.getMessages(req.params.city, (error, response) => {
        if (error) {
          return res.json({
            error: error.message
          });
        }
        let accident = response.messages
          .filter(message => message.type === 0)
          .map((message) => {
            return {
              coords: message.coords,
              text: message.text,
              time: message.time
            };
          });
        return res.json(accident);
      });
    } else {
      return res.json({
        error: 'Wrong api_key'
      });
    }
  });

  /**
   * Error handlers
   */
  app.use(function(req, res) {
    res.status(404).render('error/404');
  });

  app.use(function(err, req, res) {
    res.status(500).render('error/50x', {
      error: err
    });
  });

} catch (error) {
  console.error(error.message);
}

/**
 * Start Express server.
 */

server.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;

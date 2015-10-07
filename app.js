'use strict';

/**
 * Module dependencies.
 */

const express = require('express');
const methodOverride = require('method-override');
const logger = require('morgan');
const path = require('path');
const fs = require('fs');
const hub = require('./lib/hub');
const config = require('./config');
const os = require('os');
const mongoose = require('mongoose');
const later = require('later');
const posix = require('posix');

try {
  const cpuCount = os.cpus().length;
  const limit = 10 * 1024 * cpuCount;
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

const logFile = fs.createWriteStream(path.join(__dirname, '/log.txt'), {
  flags: 'a'
});

/**
 * Create Express server.
 */

const app = express();

/**
 * Socket
 */

const server = require('http').Server(app);
const io = require('socket.io')(server);

/**
 * Mongoose
 */

mongoose.connect(config.db);
const db = mongoose.connection;
db.on('error', function(error) {
  console.error(error);
});

/**
 * Controllers
 */

const main = require('./controller/main');
const api = require('./controller/api');
const tracker = require('./controller/tracker');

later.date.localTime();
for (let i = 0; i < config.tasks.length; i++) {
  const task = config.tasks[i];
  const scheduler = later.parse.cron(task.cron, true);
  later.setInterval(tracker[task.name].bind(this, config.cities), scheduler);
}

/**
 * Socket
 */
const sendMessages = function(city, socket) {
  return api.getMessages(city, function(error, response) {
    if (error) {
      return;
    }

    socket = socket || io.to(city);
    socket.emit('city:messages', response);
  });
};

const sendInfo = function(city, socket) {
  return api.getInfo(city, function(error, response) {
    if (error) {
      return;
    }

    socket = socket || io.to(city);
    socket.emit('city:info', response);
  });
};

const sendStats = function(city, socket) {
  return api.getStats(city, function(error, response) {
    if (error) {
      return;
    }

    socket = socket || io.to(city);
    socket.emit('city:stats', response);
  });
};

const getStatus = () => {
  return {
    online: hub.connectCounter,
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
    const city = config.cities[i].name;
    sendMessages(city);
  }
}, 5e3);

// info
setInterval(function() {
  for (let i = 0; i < config.cities.length; i++) {
    const city = config.cities[i].name;
    sendInfo(city);
  }
}, 15e3);

/**
 * Validate api keys
 */

const validateApiKey = (apiKey) => {
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
const hour = 3600000;
const day = hour * 24;
const week = day * 7;
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
    const apiKey = req.query.api_key;
    if (validateApiKey(apiKey)) {
      return api.getMessages(req.params.city, (error, response) => {
        if (error) {
          return res.json({
            error: error.message
          });
        }
        const accident = response.messages
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

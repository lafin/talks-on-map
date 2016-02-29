const express = require('express');
const webpack = require('webpack');
const Socket = require('socket.io');
const path = require('path');
const fs = require('fs');
const config = require('../webpack.config.js');

const app = express();
const compiler = webpack(config);

process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));
  app.use(require('webpack-hot-middleware')(compiler));
}

app.use('/dist', express.static(path.join(__dirname, '..', 'static')));
app.get('*', function (req, res) {
  return res.type('html').send(fs.readFileSync(path.join(__dirname, '..', 'client/index.html')));
});

const server = app.listen(process.env.PORT, function (error) {
  if (error) {
    return console.error(error);
  }
  console.log('server listening on port: %s', process.env.PORT);
});

const io = new Socket(server);
const events = require('./events')(io);

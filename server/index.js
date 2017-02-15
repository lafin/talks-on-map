const express = require('express');
const Socket = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();

process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

app.use('/static/', express.static(path.join(__dirname, '..', 'static')));
app.get('*', (req, res) => res.type('html').send(fs.readFileSync(path.join(__dirname, '..', 'client/index.html'))));

const server = app.listen(process.env.PORT, (error) => {
  if (error) {
    return console.error(error);
  }
  return console.log('server listening on port: %s', process.env.PORT);
});

const io = new Socket(server);
require('./events')(io);

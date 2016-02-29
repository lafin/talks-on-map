const api = require('./api');
const hub = require('./lib/hub');
const config = require('./config');

const sendMessages = (city, socket) => {
  return api.getMessages(city, (error, response) => {
    if (error) {
      return;
    }
    socket.emit('response talks', response);
  });
};

const sendInfo = (city, socket) => {
  return api.getInfo(city, (error, response) => {
    if (error) {
      return;
    }
    socket.emit('response info', response);
  });
};

module.exports = (io) => {
  io.on('connection', (socket) => {
    hub.connectCounter += 1;
    socket.on('set city', (city) => {
      for (const room in this.rooms) {
        this.leave(room);
      }
      this.join(city);
      sendMessages(city, socket);
      sendInfo(city, socket);
    });
    socket.on('disconnect', () => {
      hub.connectCounter -= 1;
    });
  });
  setInterval(() => {
    config.cities.map((city) => {
      sendMessages(city.name, io.to(city));
    });
  }, 5e3);
};

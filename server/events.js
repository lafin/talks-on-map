const api = require('./api');
const hub = require('./lib/hub');
const config = require('./config');

module.exports = (io) => {
  const sendMessages = (city, socket) => api.getMessages(city, (error, response) => {
    if (error) {
      return;
    }
    socket = socket || io.to(city);
    socket.emit('response talks', response);
  });

  const sendInfo = (city, socket) => api.getInfo(city, (error, response) => {
    if (error) {
      return;
    }
    socket = socket || io.to(city);
    socket.emit('response info', response);
  });
  io.on('connection', (socket) => {
    hub.connectCounter += 1;
    socket.on('set city', (city) => {
      for (let i = 0; i < socket.rooms.length; i += 1) {
        socket.leave(socket.rooms[i]);
      }
      socket.join(city);
      sendMessages(city, socket);
      sendInfo(city, socket);
    });
    socket.on('disconnect', () => {
      hub.connectCounter -= 1;
    });
  });
  setInterval(() => {
    config.cities.map(city => sendMessages(city.name));
  }, 5e3);
};

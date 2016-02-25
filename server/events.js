exports = module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('request talks', () => {
      socket.emit('response talks');
    })
  });
}

export default socket => () => next => action => {
  action.payload = Object.assign(action.payload || {}, {
    socket: socket
  });
  return next(action);
};
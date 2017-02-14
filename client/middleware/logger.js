export default store => next => (action) => {
  console.log(action, store);
  return next(action);
};

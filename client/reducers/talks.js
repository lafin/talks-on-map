
import { handleActions } from 'redux-actions';

const initialState = {
  city: 'Москва',
  points: [],
  bounds: [[0, 0], [0, 0]]
};

export default handleActions({
  'set city'(state, action) {
    const { socket, city } = action.payload;
    socket.emit('set city', city || initialState.city);

    return state;
  },

  'set talks'(state, action) {
    const { city, points } = action.payload;

    return Object.assign({}, {
      bounds: city.bounds,
      city: city.name,
      points: points
    });
  },

  'set info'(state, action) {
    return state;
  }
}, initialState);

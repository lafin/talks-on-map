
import { handleActions } from 'redux-actions'

const initialState = {
  city: 'Москва',
  points: [],
  bounds: [[0,0], [0,0]],
  center: {
    latitude: 0,
    longitude: 0
  }
}

export default handleActions({
  'set city' (state, action) {
    const { socket, city } = action.payload
    socket.emit('set city', city || initialState.city)
    return state
  },

  'set talks' (state, action) {
    const { city, points } = action.payload
    state.bounds = city.bounds
    state.center = city.center
    state.city = city.name
    state.points = points
    return state
  },

  'set info' (state, action) {
    return state
  }
}, initialState)

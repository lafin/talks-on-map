
import { handleActions } from 'redux-actions'

const initialState = [{
  city: 'Москва',
  points: [],
  zoom: null,
  center: null
}]

export default handleActions({
  'set city' (state, action) {
    return state
  },

  'get talks' (state, action) {
    const socket = action.payload
    setTimeout(() => {
      socket.emit('request talks')
    }, 1e3)
    return state
  }
}, initialState)

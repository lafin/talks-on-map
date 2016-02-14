
import { handleActions } from 'redux-actions'

const initialState = [{
  city: 'Москва',
  points: [],
  zoom: null,
  center: null
}]

export default handleActions({

}, initialState)

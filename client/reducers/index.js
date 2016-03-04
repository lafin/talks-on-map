
import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import talks from './talks';

export default combineReducers({
  routing,
  talks
});

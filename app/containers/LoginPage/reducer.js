import { Map } from 'immutable';

import * as actionTypes from './constants';

// The initial state of the App
const initialState = new Map({
  email: '',
  password: '',
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_EMAIL:
      return state.set('email', action.email);

    case actionTypes.SET_PASSWORD:
      return state.set('password', action.password);

    default:
      return state;
  }
}

export default homeReducer;

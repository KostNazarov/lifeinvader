import { Map } from 'immutable';

import * as actionTypes from './constants';

// The initial state of the App
const initialState = new Map({
  value: '',
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_INPUT:
      return state.set('value', action.value);

    default:
      return state;
  }
}

export default homeReducer;

import { Map } from 'immutable';

import * as actionTypes from './constants';

// The initial state of the App
const initialState = new Map({
  value: '',
  filter: '',
  users: new Map({}),
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_INPUT:
      return state.set('value', action.value);

    case actionTypes.SET_FILTER:
      return state.set('filter', action.filter);

    case actionTypes.SET_USERS:
      // console.log('SET_USERS', action.users);
      return state.set('users', new Map(action.users));

    default:
      return state;
  }
}

export default homeReducer;

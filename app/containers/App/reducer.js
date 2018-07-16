import { List, Map } from 'immutable';
import { pick } from 'utils/object';

import * as actionTypes from './constants';

// The initial state of the App
const initialState = new Map({
  user: JSON.parse(localStorage.getItem('li-auth-uid')) || {},
  subscriptions: new List([]),
  error: '',
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_USER: // eslint-disable-line
      // console.log('SET_USER', action.user);
      return state.set('user', pick(action.user, [
        'displayName',
        'uid',
        'photoURL',
        'email',
        'emailVerified',
        'isAnonymous',
        'metadata',
        'phoneNumber',
        'refreshToken',
      ]));

    case actionTypes.LOGGED_OUT:
      return state.set('user', {});

    case actionTypes.SET_SUBSCRIPTIONS:
      // console.log('SET_SUBSCRIPTIONS', action.subscriptions);
      return state.set('subscriptions', new List(action.subscriptions));

    case actionTypes.UPDATE_PHOTO:
      return state.update('user', (user) => ({ ...user, photoURL: action.url }));

    case actionTypes.UPDATE_NICKNAME:
      return state.update('user', (user) => ({ ...user, displayName: action.displayName }));

    case actionTypes.SET_SUBINFO:
      // console.log('SET_SUBINFO', action.info);
      return state.update('user', (user) => ({ ...user, ...action.info }));

    case actionTypes.SET_STATUS:
      return state.update('user', (user) => ({ ...user, status: action.status }));

    case actionTypes.SET_ERROR:
      return state.set('error', action.error);

    default:
      return state;
  }
}

export default homeReducer;

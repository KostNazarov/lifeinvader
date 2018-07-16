/**
 * Gets the repositories of the user from Github
 */

import { put, takeLatest } from 'redux-saga/effects';
import app from 'containers/App/firebaseConfig';
import { setUsers } from './actions';
import { LOAD_USERS } from './constants';
import { setError } from '../App/actions';

const database = app.database();

export function* handleLoadUsers() {
  try {
    const rawUsers = yield database.ref('users').once('value');
    const users = Object.values(rawUsers.val() || {});
    const mainData = {};
    users.forEach((user) => {
      mainData[user.uid] = {
        displayName: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
      };
    });
    yield put(setUsers(mainData));
  } catch (error) {
    // console.error(error);
    yield put(setError(error.message));
  }
}

export default function* userData() {
  yield takeLatest(LOAD_USERS, handleLoadUsers);
}

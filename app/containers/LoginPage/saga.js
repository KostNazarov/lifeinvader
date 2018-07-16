/**
 * Gets the repositories of the user from Github
 */

import { put, takeLatest } from 'redux-saga/effects';
import formatErrorMessage from 'utils/formatErrorMessage';
import app from 'containers/App/firebaseConfig';
import { setUser, setError } from 'containers/App/actions';
import { LOGIN } from './constants';

export function* handleLogin(action) {
  const auth = app.auth();
  const email = action.email;
  const password = action.password;

  try {
    const data = yield auth.signInWithEmailAndPassword(email, password);
    const user = { ...data.user };
    user.displayName = user.displayName || user.uid;
    yield put(setUser(user));
  } catch (error) {
    // console.error(error);
    yield put(setError(formatErrorMessage(error)));
  }
}

export default function* loginSaga() {
  yield takeLatest(LOGIN, handleLogin);
}

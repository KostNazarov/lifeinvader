import { put, takeLatest } from 'redux-saga/effects';
import formatErrorMessage from 'utils/formatErrorMessage';
import app from 'containers/App/firebaseConfig';
import { setError } from '../App/actions';
import { REGISTER } from './constants';

const database = app.database();
const defaultAvatar = 'http://www.gigtime.co/assets/fallback/default_user_avatar_huge.jpg';

export function* handleRegister(action) {
  const auth = app.auth();
  const key = action.key;
  const email = action.email;
  const password = action.password;

  const ref = database.ref(`keys/${key}`);
  try {
    const rawKey = yield ref.once('value');
    if (key && rawKey.val()) {
      yield ref.set({});
    } else {
      yield put(setError(formatErrorMessage('auth/invalid-key')));
      return;
    }

    const credentials = yield auth.createUserWithEmailAndPassword(email, password);
    const user = credentials.user;
    yield database.ref(`users/${user.uid}`).set({
      photoURL: defaultAvatar,
      displayName: user.uid,
      uid: user.uid,
      key,
    });
    yield database.ref(`displayNames/${user.uid}`).set(user.uid);
  } catch (error) {
    // console.error(error);
    yield put(setError(formatErrorMessage(error)));
  }
}

export default function* userData() {
  yield takeLatest(REGISTER, handleRegister);
}

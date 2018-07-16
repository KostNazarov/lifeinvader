/**
 * Gets the repositories of the user from Github
 */

import { put, takeLatest } from 'redux-saga/effects';
import formatErrorMessage from 'utils/formatErrorMessage';
import app from 'containers/App/firebaseConfig';
import { setUser, setPosts, setPostLiked } from './actions';
import { LOAD_USER, TOGGLE_LIKE } from './constants';
import { setError } from '../App/actions';

const database = app.database();

export function* handleLoadUser(action) {
  let uid = action.uid;

  try {
    if (uid[0] === '@' && uid[1] != null) {
      const displayName = uid.substring(1, uid.length);
      const rawUid = yield database.ref(`displayNames/${displayName}`).once('value');
      uid = rawUid.val();
    }

    const userSnapshot = yield database.ref(`users/${uid}`).once('value');
    const user = userSnapshot.val();
    if (user) {
      yield put(setUser(user));
    } else {
      yield put(setError(formatErrorMessage('user/not-found')));
      return;
    }

    const posts = Object
      .values(user.posts || {})
      .sort((a, b) => b.date - a.date)
      .map((post) => ({
        ...post,
        author: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
      }));

    yield put(setPosts(posts));
  } catch (error) {
    // console.error(error);
    yield put(setError(error.message));
  }
}

export function* handleToggleLike(action) {
  const uid = app.auth().currentUser.uid;
  const post = action.post;
  const authorUid = post.uid;
  const postDate = post.date;
  const liked = !(post.likes && post.likes[uid]);

  try {
    yield put(setPostLiked(post, uid, liked));
    yield database.ref(`users/${authorUid}/posts/${postDate}/likes/${uid}`).set(liked || {});
  } catch (error) {
    // console.error(error);
    yield put(setError(error.message));
  }
}

export default function* userData() {
  yield takeLatest(LOAD_USER, handleLoadUser);
  yield takeLatest(TOGGLE_LIKE, handleToggleLike);
}

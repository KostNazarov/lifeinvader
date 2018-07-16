/**
 * Gets the repositories of the user from Github
 */

import { put, takeLatest, takeEvery } from 'redux-saga/effects';
import formatErrorMessage from 'utils/formatErrorMessage';
import { pick } from 'utils/object';

import {
  TOGGLE_LIKE,
  LOGOUT,
  UPDATE_PHOTO,
  LOAD_SUBSCRIPTIONS,
  SET_USER,
  ADD_SUBSCRIPTION,
  REMOVE_SUBSCRIPTION,
  SET_STATUS,
} from './constants';

import {
  loggedOut,
  setSubscriptions,
  loadSubscriptions,
  setSubinfo,
  setError,
  updatePhoto,
  updateNickname,
} from './actions';

// import request from 'utils/request';
import app from './firebaseConfig';
const defaultAvatar = 'http://www.gigtime.co/assets/fallback/default_user_avatar_huge.jpg';

/* eslint-disable no-console*/
const database = app.database();

export function* handleLogout() {
  try {
    yield app.auth().signOut();
    localStorage.removeItem('li-auth-uid');
    yield put(loggedOut());
  } catch (error) {
    // console.error(error);
    yield put(setError(error.message));
  }
}

export function* handleUpdatePhoto(action) {
  const currentUser = app.auth().currentUser;
  const uid = currentUser.uid;
  const url = action.url;

  if (url.indexOf('data://') === 0) {
    yield put(setError(formatErrorMessage('url/contain-data')));
    return;
  }

  try {
    yield currentUser.updateProfile({ photoURL: url });
    yield database.ref(`users/${uid}/photoURL`).set(action.url);
  } catch (error) {
    // console.error(error);
    yield put(setError(error.message));
  }
}

export function* handleLoadSubscriptions(action) {
  const uid = action.uid;
  if (!uid) {
    return;
  }

  try {
    const rawSubscriptions = yield database.ref(`users/${uid}/subscriptions`).once('value');
    const subscriptions = rawSubscriptions.val();
    yield put(setSubscriptions(Object.values(subscriptions || {})));
  } catch (error) {
    // console.error(error);
    yield put(setError(error.message));
  }
}

export function* handleSetUser(action) {
  const currentUser = app.auth().currentUser;
  let user = action.user;

  try {
    const ref = database.ref(`users/${user.uid}`);
    const rawUserData = yield ref.once('value');
    const userInfo = rawUserData.val();
    if (userInfo) {
      // LOAD SUBINFO
      const subInfo = pick(userInfo, [
        'status',
        'subscribers',
        'posts',
        'key',
        'dev',
        'post',
      ]);
      yield put(setSubinfo(subInfo));
    }

    user = pick(user, [
      'displayName',
      'uid',
      'photoURL',
      'email',
      'emailVerified',
      'isAnonymous',
      'metadata',
      'phoneNumber',
      'refreshToken',
    ]);

    if (!currentUser.displayName || !currentUser.photoURL || currentUser.displayName !== user.displayName || currentUser.photoURL !== user.photoURL) {
      const data = {
        displayName: user.displayName || user.uid,
        photoURL: user.photoURL || defaultAvatar,
      };
      // currentUser.updateProfile(data);
      yield put(updatePhoto(data.photoURL));
      yield put(updateNickname(data.displayName));
    }

    localStorage.setItem('li-auth-uid', JSON.stringify(user));
  } catch (error) {
    // console.error(error);
    yield put(setError(error.message));
  }
}

export function* handleAddSubscription(action) {
  const currentUser = app.auth().currentUser;
  const nickname = currentUser.displayName;

  if (nickname === action.subscription) {
    yield put(setError(formatErrorMessage('sub/on-self')));
    return;
  }

  const rawUid = yield database.ref(`displayNames/${action.subscription}`).once('value');

  const rawData = yield database.ref(`users/${rawUid.val()}`).once('value');
  const user = rawData.val();
  if (user) {
    const subscription = {
      date: Date.now(),
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };

    const subscribed = {
      date: Date.now(),
      uid: currentUser.uid,
      displayName: currentUser.displayName,
      photoURL: currentUser.photoURL,
    };

    try {
      yield database.ref(`users/${currentUser.uid}/subscriptions/${subscription.uid}`).set(subscription);
      yield database.ref(`users/${subscription.uid}/subscribers/${currentUser.uid}`).set(subscribed);
      yield put(loadSubscriptions(currentUser.uid));

      const log = {
        date: Date.now(),
        read: false,
        type: 'SUBSCRIBED',
        content: subscribed,
      };
      yield database.ref(`users/${subscription.uid}/news/${log.date}`).set(log);
    } catch (error) {
      // console.error(error);
      yield put(setError(error.message));
    }
  }
}

export function* handleSetStatus(action) {
  const user = app.auth().currentUser;
  if (!user) {
    return;
  }

  const uid = user.uid;
  try {
    yield database.ref(`users/${uid}/status`).set(action.status);
  } catch (error) {
    // console.error(error);
    yield put(setError(error.message));
  }
}

export function* handleRemoveSubscription(action) {
  const currentUser = app.auth().currentUser;
  const subscription = action.subscription;

  try {
    yield database.ref(`users/${currentUser.uid}/subscriptions/${subscription.uid}`).set({});
    yield database.ref(`users/${subscription.uid}/subscribers/${currentUser.uid}`).set({});
    yield put(loadSubscriptions(currentUser.uid));

    const log = {
      date: Date.now(),
      read: false,
      type: 'UNSUBSCRIBED',
      content: {
        date: Date.now(),
        uid: currentUser.uid,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
      },
    };
    yield database.ref(`users/${subscription.uid}/news/${log.date}`).set(log);
  } catch (error) {
    // console.error(error);
    yield put(setError(error.message));
  }
}

export function* handleToggleLike(action) {
  const uid = app.auth().currentUser.uid;
  const post = action.post;
  const liked = !(post.likes && post.likes[uid]);
  const authorId = post.uid;
  const postId = post.date;

  try {
    yield database.ref(`users/${authorId}/posts/${postId}/likes/${uid}`).set(liked || {});
  } catch (error) {
    // console.error(error);
    yield put(setError(error.message));
  }
}

export default function* appSaga() {
  yield takeLatest(LOGOUT, handleLogout);
  yield takeLatest(UPDATE_PHOTO, handleUpdatePhoto);
  yield takeLatest(SET_USER, handleSetUser);

  yield takeLatest(LOAD_SUBSCRIPTIONS, handleLoadSubscriptions);
  yield takeEvery(ADD_SUBSCRIPTION, handleAddSubscription);
  yield takeEvery(REMOVE_SUBSCRIPTION, handleRemoveSubscription);

  yield takeLatest(TOGGLE_LIKE, handleToggleLike);
  yield takeLatest(SET_STATUS, handleSetStatus);
}
